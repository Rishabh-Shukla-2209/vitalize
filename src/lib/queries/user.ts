import { isSameDay, startOfToday, subDays } from "date-fns";
import prisma from "../db";
import { safeQuery, safeTransaction } from "../safeQueries";
import { Cursor, FollowStatus, PrivacyType } from "../types";
import { Prisma } from "@/generated/prisma/client";
import { Gender } from "@/generated/prisma/enums";
import { pusherServer } from "../pusher-server";

export const createUser = async (id: string, email: string) => {
  if (await prisma.user.findUnique({ where: { id } })) return;

  const user = await prisma.user.create({
    data: {
      id,
      email,
    },
  });

  return user;
};

export const updateUserQuery = async (
  userId: string,
  updatedData: {
    imgUrl?: string;
    about?: string;
    bio?: string;
    privacy?: PrivacyType;
  },
) => {
  return safeQuery(
    async () =>
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: updatedData,
      }),
  );
};

export const saveOnboardingDataQuery = async (
  id: string,
  values: {
    firstName: string;
    lastName: string;
    imgUrl: string;
    weight: number;
    height: number;
    gender: Gender;
    dob: Date;
  },
) => {
  return safeTransaction(async (tx) => {
    await tx.user.update({
      where: {
        id,
      },
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        gender: values.gender,
        imgUrl: values.imgUrl,
        dateOfBirth: values.dob,
      },
    });

    await tx.measurement.create({
      data: {
        user: { connect: { id } },
        height: values.height,
        weight: values.weight,
      },
    });
  });
};

export const getStreaksQuery = async (userId: string) => {
  return safeQuery(async () => {
    const streaks = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        currentStreakDays: true,
        longestStreakDays: true,
        lastActiveOn: true,
      },
    });

    if (
      streaks?.currentStreakDays === 0 ||
      (streaks?.lastActiveOn &&
        (isSameDay(subDays(new Date(), 1), streaks.lastActiveOn) ||
          isSameDay(new Date(), streaks.lastActiveOn)))
    ) {
      return streaks;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentStreakDays: 0,
      },
    });

    return {
      currentStreakDays: 0,
      longestStreakDays: streaks?.longestStreakDays,
    };
  });
};

export const hasWorkedOutTodayQuery = async (userId: string) => {
  return safeQuery(async () => {
    const result = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lastActiveOn: true,
      },
    });
    if (!result?.lastActiveOn) {
      return false;
    }

    if (result.lastActiveOn < startOfToday()) {
      return false;
    }

    return true;
  });
};

export const getNoOfWorkoutsDoneQuery = async (userId: string) => {
  return safeQuery(async () => {
    return await prisma.workoutLog.count({
      where: {
        userId,
      },
    });
  });
};

export const getNoOfPRsQuery = async (userId: string) => {
  return safeQuery(async () => {
    return await prisma.pR.count({
      where: {
        userid: userId,
      },
    });
  });
};

export const getUserQuery = async (userId: string) => {
  return safeQuery(async () => {
    const data = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return data;
  });
};

export const getUserAIWorkoutsQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
) => {
  return safeQuery(async () => {
    const findArgs: Prisma.WorkoutPlanFindManyArgs = {
      take: direction === "next" ? 5 : -5,
      where: {
        userId,
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    };

    const data = await prisma.workoutPlan.findMany(findArgs);

    return data;
  });
};

export const getUserPostsQuery = async (
  userId: string,
  cursor: Cursor,
  callerId: string,
) => {
  return safeQuery(async () => {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId: callerId, followingId: userId },
        status: "ACCEPTED",
      },
    });

    const callerFollowsUser = follow ? true : false;

    const posts = await prisma.post.findMany({
      take: 10,
      ...(cursor && { skip: 1, cursor }),
      where: {
        userid: userId,
        ...(!callerFollowsUser && { privacy: "PUBLIC" }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imgUrl: true,
            privacy: true,
          },
        },
        workoutLog: {
          include: {
            exercises: {
              include: { exercise: { select: { name: true } } },
            },
          },
        },
        _count: {
          select: {
            Comment: true,
            PostLike: true,
          },
        },
      },
    });

    if (posts.length === 0) {
      return { posts: [], cursor: null };
    }

    const likes = await prisma.postLike.findMany({
      where: {
        userid: callerId,
        postid: { in: posts.map((post) => post.id) },
      },
      select: {
        postid: true,
      },
    });

    const postsLikedIds = new Set(likes.map((like) => like.postid));
    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      liked: postsLikedIds.has(post.id),
      followStatus: callerFollowsUser
        ? "Accepted"
        : ("Not Following" as FollowStatus),
    }));
    return {
      posts: postsWithLikeStatus,
      cursor: {
        createdAt: posts.at(-1)!.createdAt,
        id: posts.at(-1)!.id,
      },
    };
  });
};

export const getFollowingStatusQuery = async (
  followerId: string,
  followingId: string,
) => {
  return safeQuery(async () => {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
      select: {
        status: true,
      },
    });

    return follow
      ? follow.status === "ACCEPTED"
        ? "Accepted"
        : "Requested"
      : "Not Following";
  });
};

export const updateNotifReadStatusQuery = async (id: string) => {
  return safeQuery(async () => {
    const notification = await prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) return;

    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  });
};

export const getNotificationRecipient = async (id: string) => {
  return safeQuery(async () => {
    return await prisma.notification.findUnique({
      where: {
        id,
      },
      select: {
        recipientid: true,
      },
    });
  });
};

export const getNotificationsQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
) => {
  return safeQuery(async () => {
    const data = await prisma.notification.findMany({
      take: 20,
      ...(cursor && { cursor, skip: 1 }),
      where: {
        recipientid: userId,
      },
      include: {
        actor: {
          select: {
            firstName: true,
            id: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return data;
  });
};

export const getPostsActivityQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
) => {
  return safeQuery(async () => {
    const data = await prisma.post.findMany({
      take: direction === "next" ? 5 : -5,
      where: {
        userid: userId,
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return data;
  });
};

export const getPostLikesActivityQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
) => {
  return safeQuery(async () => {
    const data = await prisma.postLike.findMany({
      take: direction === "next" ? 5 : -5,
      where: {
        userid: userId,
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
      select: {
        id: true,
        postid: true,
        createdAt: true,
        post: {
          select: {
            user: {
              select: {
                firstName: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return data;
  });
};

export const getCommentLikesActivityQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
) => {
  return safeQuery(async () => {
    const data = await prisma.commentLike.findMany({
      take: direction === "next" ? 5 : -5,
      where: {
        userid: userId,
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
      select: {
        id: true,
        commentid: true,
        createdAt: true,
        comment: {
          select: {
            postid: true,
            post: {
              select: {
                user: {
                  select: {
                    firstName: true,
                  },
                },
              },
            },
            user: {
              select: {
                firstName: true,
              },
            },
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return data;
  });
};

export const getCommentsActivityQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
) => {
  return safeQuery(async () => {
    const data = await prisma.comment.findMany({
      take: direction === "next" ? 5 : -5,
      where: {
        userid: userId,
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
      select: {
        id: true,
        postid: true,
        text: true,
        post: {
          select: {
            user: {
              select: {
                firstName: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return data;
  });
};

export const updateFollowQuery = async (
  notificationId: string,
  followerId: string,
  followingId: string,
) => {
  const { data: follow, error } = await safeQuery(async () => {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
    return follow;
  });

  if (error) throw error;
  if (!follow) return;

  const { data: newNotification, error: transactionError } =
    await safeTransaction(async (tx) => {
      await tx.follow.update({
        where: {
          followerId_followingId: { followerId, followingId },
        },
        data: {
          status: "ACCEPTED",
        },
      });

      await tx.notification.updateMany({
        where: {
          id: notificationId,
        },
        data: {
          type: "FOLLOW",
          isRead: true,
        },
      });

      return await tx.notification.create({
        data: {
          actorId: followingId,
          recipientid: followerId,
          type: "FOLLOW_ACCEPTED",
        },
        include: {
          actor: {
            select: {
              firstName: true,
            },
          },
        },
      });
    });

  if (newNotification) {
    await pusherServer.trigger(
      `private-user-${followerId}`,
      "notification:new",
      newNotification,
    );
  } else {
    throw transactionError;
  }
};

export const getUnreadNotificationCountQuery = async (userId: string) => {
  return safeQuery(async () => {
    return await prisma.notification.count({
      where: {
        recipientid: userId,
        isRead: false,
      },
    });
  });
};

export const getFollowersQuery = async (
  userId: string,
  callerId: string | undefined = undefined,
) => {
  return safeQuery(async () => {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
        status: "ACCEPTED",
      },
      select: {
        follower: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!callerId) return followers;

    const [follow, privacy] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: callerId, followingId: userId },
        },
        select: {
          status: true,
          following: {
            select: {
              privacy: true,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          privacy: true,
        },
      }),
    ]);

    if (
      follow &&
      (follow.status === "ACCEPTED" || privacy?.privacy === "PUBLIC")
    ) {
      return followers;
    }

    return [];
  });
};

export const getFollowingQuery = async (
  userId: string,
  callerId: string | undefined = undefined,
) => {
  return safeQuery(async () => {
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
        status: "ACCEPTED",
      },
      select: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imgUrl: true,
          },
        },
      },
    });

    if (!callerId) return following;

    const [follow, privacy] = await Promise.all([
      prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: callerId, followingId: userId },
        },
        select: {
          status: true,
        },
      }),
      prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          privacy: true,
        },
      }),
    ]);

    if (
      follow &&
      (follow.status === "ACCEPTED" || privacy?.privacy === "PUBLIC")
    ) {
      return following;
    }

    return [];
  });
};
