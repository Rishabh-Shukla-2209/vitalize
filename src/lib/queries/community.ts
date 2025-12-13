import { User } from "@/generated/prisma/client";
import prisma from "../db";
import { pusherServer } from "../pusher-server";
import { CommentType, PrivacyType, Source } from "../types";
import { safeQuery } from "../safeQueries";

export const getPostsQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  source: Source,
) => {
  return safeQuery(async () => {
    const following = await prisma.follow.findMany({
      where: { followerId: userId, status: "ACCEPTED" },
      select: { followingId: true, status: true },
    });

    const followingIds = following.map((f) => f.followingId);

    if (source === "friends") {
      const friendsPosts = await prisma.post.findMany({
        take: 10,
        ...(cursor && { skip: 1, cursor }),
        where: { userid: { in: followingIds } },
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

      if (friendsPosts.length === 10) {
        const likes = await prisma.postLike.findMany({
          where: {
            userid: userId,
            postid: { in: friendsPosts.map((post) => post.id) },
          },
          select: {
            postid: true,
          },
        });

        const postsLikedIds = new Set(likes.map((like) => like.postid));
        const posts = friendsPosts.map((post) => ({
          ...post,
          liked: postsLikedIds.has(post.id),
        }));
        return {
          posts,
          cursor: {
            createdAt: posts.at(-1)!.createdAt,
            id: posts.at(-1)!.id,
          },
          nextSource: "friends",
        };
      }

      const excludedIds = [...followingIds, userId];
      const remaining = 10 - friendsPosts.length;

      const publicPosts = await prisma.post.findMany({
        take: remaining,
        where: {
          userid: { notIn: excludedIds },
          privacy: "PUBLIC",
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

      const postsWithoutLikesAdded = [...friendsPosts, ...publicPosts];

      if (postsWithoutLikesAdded.length === 0) {
        return { posts: [], cursor: null, nextSource: null };
      }

      const likes = await prisma.postLike.findMany({
        where: {
          userid: userId,
          postid: { in: postsWithoutLikesAdded.map((post) => post.id) },
        },
        select: {
          postid: true,
        },
      });

      const postsLikedIds = new Set(likes.map((like) => like.postid));
      const postsWithLikes = postsWithoutLikesAdded.map((post) => ({
        ...post,
        liked: postsLikedIds.has(post.id),
      }));

      return {
        posts: postsWithLikes,
        cursor: {
          createdAt: postsWithLikes.at(-1)!.createdAt,
          id: postsWithLikes.at(-1)!.id,
        },
        nextSource: publicPosts.length > 0 ? "public" : null,
      };
    }

    const publicPosts = await prisma.post.findMany({
      take: 10,
      ...(cursor && { skip: 1, cursor }),
      where: {
        userid: { notIn: [...followingIds, userId] },
        privacy: "PUBLIC",
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

    if (publicPosts.length === 0) {
      return { posts: [], cursor: null, nextSource: null };
    }

    const likes = await prisma.postLike.findMany({
      where: {
        userid: userId,
        postid: { in: publicPosts.map((post) => post.id) },
      },
      select: {
        postid: true,
      },
    });

    const postsLikedIds = new Set(likes.map((like) => like.postid));
    const posts = publicPosts.map((post) => ({
      ...post,
      liked: postsLikedIds.has(post.id),
    }));

    return {
      posts,
      cursor: {
        createdAt: posts.at(-1)!.createdAt,
        id: posts.at(-1)!.id,
      },
      nextSource: "public",
    };
  });
};

export const savePostReactionQuery = async (
  postId: string,
  authorId: string,
  userId: string,
  reaction: "liked" | "unliked",
) => {
  return safeQuery(async () => {
    const newNotification = await prisma.$transaction(async (tx) => {
      if (reaction === "liked") {
        await tx.postLike.create({
          data: {
            userid: userId,
            postid: postId,
          },
        });

        if (userId === authorId) return;

        return await tx.notification.create({
          data: {
            actorId: userId,
            recipientid: authorId,
            type: "LIKE_POST",
            postid: postId,
          },
          include: {
            actor: {
              select: {
                firstName: true,
              },
            },
          },
        });
      }

      await tx.postLike.delete({
        where: {
          postid_userid: { postid: postId, userid: userId },
        },
      });

      await tx.notification.deleteMany({
        where: {
          actorId: userId,
          recipientid: authorId,
          postid: postId,
          type: "LIKE_POST",
        },
      });

      return null;
    });

    if (newNotification) {
      await pusherServer.trigger(
        `private-user-${authorId}`,
        "notification:new",
        newNotification,
      );
    }
  });
};

export const saveCommentQuery = async (
  postId: string,
  authorId: string,
  userId: string,
  text: string,
  parentId?: string,
  parentAuthorId?: string,
) => {
  return safeQuery(async () => {
    const comment = await prisma.comment.create({
      data: {
        userid: userId,
        postid: postId,
        text,
        ...(parentId && { parentid: parentId }),
      },
    });

    if (userId === (parentId ? parentAuthorId! : authorId)) return comment;

    if (comment) {
      const newNotification = await prisma.notification.create({
        data: {
          actorId: userId,
          recipientid: parentId ? parentAuthorId! : authorId,
          type: parentId ? "COMMENT_COMMENT" : "COMMENT_POST",
          postid: postId,
          commentid: comment.id,
        },
        include: {
          actor: {
            select: {
              firstName: true,
            },
          },
        },
      });

      if (newNotification) {
        await pusherServer.trigger(
          `private-user-${parentId ? parentAuthorId! : authorId}`,
          "notification:new",
          newNotification,
        );
      }
    }

    return comment;
  });
};

export const saveFollowingQuery = async (
  followerId: string,
  followingId: string,
  followingPrivacy: PrivacyType,
  action: "follow" | "unFollow",
) => {
  return safeQuery(async () => {
    const newNotification = await prisma.$transaction(async (tx) => {
      if (action === "follow") {
        await tx.follow.create({
          data: {
            followerId,
            followingId,
            status: followingPrivacy === "PRIVATE" ? "REQUESTED" : "ACCEPTED",
          },
        });

        return await tx.notification.create({
          data: {
            actorId: followerId,
            recipientid: followingId,
            type:
              followingPrivacy === "PRIVATE" ? "FOLLOW_REQUESTED" : "FOLLOW",
          },
          include: {
            actor: {
              select: {
                firstName: true,
              },
            },
          },
        });
      } else {
        await tx.follow.delete({
          where: {
            followerId_followingId: { followerId, followingId },
          },
        });

        await tx.notification.deleteMany({
          where: {
            actorId: followerId,
            recipientid: followingId,
            type: {
              in: ["FOLLOW", "FOLLOW_REQUESTED"],
            },
          },
        });
        return null;
      }
    });

    if (newNotification) {
      await pusherServer.trigger(
        `private-user-${followingId}`,
        "notification:new",
        newNotification,
      );
    }
  });
};

export const getPostLikesQuery = async (postId: string) => {
  return safeQuery(async () => {
    const likes = await prisma.postLike.findMany({
      where: {
        postid: postId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, imgUrl: true },
        },
      },
    });

    return likes;
  });
};

const getCommentTree = (comments: CommentType[]): CommentType[] => {
  const commentsMap = new Map<string, CommentType>();

  comments.forEach((c) => {
    commentsMap.set(c.id, { ...c, replies: [] });
  });

  const commentsTree: CommentType[] = [];

  comments.forEach((comment) => {
    const mappedComment = commentsMap.get(comment.id)!;

    if (comment.parentid === null) {
      commentsTree.push(mappedComment);
    } else {
      const parent = commentsMap.get(comment.parentid);
      if (parent) {
        parent.replies!.push(mappedComment);
      }
    }
  });

  return commentsTree;
};

export const getCommentsQuery = async (userId: string, postId: string) => {
  return safeQuery(async () => {
    const comments = await prisma.comment.findMany({
      where: {
        postid: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imgUrl: true,
          },
        },
        _count: {
          select: {
            CommentLike: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const likes = await prisma.commentLike.findMany({
      where: {
        userid: userId,
        commentid: { in: comments.map((c) => c.id) },
      },
      select: {
        commentid: true,
      },
    });

    const commentsLikedIds = new Set(likes.map((like) => like.commentid));
    const commentsWithLikeStatus = comments.map((c) => ({
      ...c,
      liked: commentsLikedIds.has(c.id),
    }));

    return getCommentTree(commentsWithLikeStatus);
  });
};

export const saveCommentReactionQuery = async (
  commentId: string,
  commentAuthorId: string,
  postId: string,
  userId: string,
  reaction: "liked" | "unliked",
) => {
  return safeQuery(async () => {
    const newNotification = await prisma.$transaction(async (tx) => {
      if (reaction === "liked") {
        await tx.commentLike.create({
          data: {
            userid: userId,
            commentid: commentId,
          },
        });

        if (userId === commentAuthorId) return;

        return await tx.notification.create({
          data: {
            actorId: userId,
            recipientid: commentAuthorId,
            type: "LIKE_COMMENT",
            postid: postId,
            commentid: commentId,
          },
          include: {
            actor: {
              select: {
                firstName: true,
              },
            },
          },
        });
      } else {
        await tx.commentLike.delete({
          where: {
            commentid_userid: { commentid: commentId, userid: userId },
          },
        });

        await tx.notification.deleteMany({
          where: {
            actorId: userId,
            recipientid: commentAuthorId,
            commentid: commentId,
            type: "LIKE_COMMENT",
          },
        });

        return null;
      }
    });

    if (newNotification) {
      await pusherServer.trigger(
        `private-user-${commentAuthorId}`,
        "notification:new",
        newNotification,
      );
    }
  });
};

export const getCommentLikesQuery = async (commentId: string) => {
  return safeQuery(async () => {
    const likes = await prisma.commentLike.findMany({
      where: {
        commentid: commentId,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, imgUrl: true },
        },
      },
    });

    return likes;
  });
};

export const deleteCommentQuery = async (id: string) => {
  return safeQuery(async () => {
    await prisma.comment.delete({
      where: { id },
    });
  });
};

export const getSuggestionsQuery = async (excludeList: string[]) => {
  return safeQuery(async () => {
    const randomUsers = await prisma.$queryRaw`
  SELECT *
  FROM "User"
  WHERE id NOT IN (${excludeList.join(",")})
  ORDER BY RANDOM()
  LIMIT 5;
`;

    return randomUsers as User[];
  });
};

export const searchUsersQuery = async (userId: string, search: string) => {
  return safeQuery(async () => {
    const data = await prisma.user.findMany({
      take: 20,
      where: {
        id: {
          not: userId,
        },
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    return data;
  });
};

export const createPostQuery = async (
  userId: string,
  postData: {
    title: string;
    privacy: PrivacyType;
    body?: string;
    imgUrl?: string;
    workoutLogid?: string;
  },
) => {
  return safeQuery(async () => {
    if (postData.workoutLogid) {
      await prisma.workoutLog.findUnique({
        where: {
          id: postData.workoutLogid,
          userId,
        },
      });
    }

    await prisma.post.create({
      data: {
        userid: userId,
        title: postData.title,
        privacy: postData.privacy,
        ...(postData.body && { body: postData.body }),
        ...(postData.imgUrl && { imgUrl: postData.imgUrl }),
        ...(postData.workoutLogid && { workoutLogid: postData.workoutLogid }),
      },
    });
  });
};

export const getPostQuery = async (postId: string, userId: string) => {
  return safeQuery(async () => {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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

    if (!post) return null;

    const like = await prisma.postLike.findUnique({
      where: {
        postid_userid: { postid: postId, userid: userId },
      },
      select: {
        postid: true,
      },
    });

    const postWithLikeStatus = {
      ...post,
      liked: like ? true : false,
    };

    return postWithLikeStatus;
  });
};

export const getPostPrivacy = async (postId: string) => {
  return safeQuery(async () => {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        privacy: true,
        userid: true,
      },
    });

    return post;
  });
};

export const getCommentOwner = async (commentId: string) => {
  return safeQuery(async () => {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userid: true,
      },
    });

    return comment?.userid;
  });
};
