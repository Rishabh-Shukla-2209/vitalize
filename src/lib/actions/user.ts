"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Cursor, PrivacyType } from "../types";
import { Gender } from "@/generated/prisma/enums";
import { ensureOwnership, requireUser } from "../auth";
import { ValidationError } from "../errors";
import {
  getCommentLikesActivityQuery,
  getCommentsActivityQuery,
  getFollowingStatusQuery,
  getNoOfPRsQuery,
  getNoOfWorkoutsDoneQuery,
  getNotificationRecipient,
  getNotificationsQuery,
  getPostLikesActivityQuery,
  getPostsActivityQuery,
  getStreaksQuery,
  getUnreadNotificationCountQuery,
  getUserAIWorkoutsQuery,
  getUserPostsQuery,
  getUserQuery,
  hasWorkedOutTodayQuery,
  saveOnboardingDataQuery,
  updateFollowQuery,
  updateNotifReadStatusQuery,
  updateUserQuery,
} from "../queries/user";
import { updateUserSchema } from "@/validations/user";
import { onboardingSchemaServer } from "@/validations/auth";

export async function completeOnboarding(firstName: string, lastName: string) {
  const { userId } = await auth();

  if (!userId) {
    return { status: "error", message: "User not found." };
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(userId, {
      firstName,
      lastName,
      publicMetadata: {
        hasOnboarded: true,
      },
    });
    revalidatePath("/", "layout");
    return { status: "success" };
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return { status: "error", message: "Something went wrong." };
  }
}

export const updateUser = async (updatedData: {
  imgUrl?: string;
  about?: string;
  bio?: string;
  privacy?: PrivacyType;
}) => {
  const userId = await requireUser();
  const parsed = updateUserSchema.safeParse(updatedData);

  if (!parsed.success) {
    throw new ValidationError("Invalid user update payload", {
      cause: parsed.error.issues,
    });
  }

  const { data, error } = await updateUserQuery(userId, parsed.data);

  if (error) throw error;
  return data;
};

export const saveOnboardingData = async (values: {
  firstName: string;
  lastName: string;
  imgUrl: string;
  weight: number;
  height: number;
  gender: Gender;
  dob: Date;
}) => {
  const userId = await requireUser();
  const parsed = onboardingSchemaServer.safeParse(values);

  if (!parsed.success) {
    throw new ValidationError("Invalid user onboarding payload", {
      cause: parsed.error.issues,
    });
  }

  const { data, error } = await saveOnboardingDataQuery(userId, parsed.data);

  if (error) throw error;
  return data;
};

export const getStreaks = async () => {
  const userId = await requireUser();

  const { data, error } = await getStreaksQuery(userId);

  if (error) throw error;
  return data;
};

export const hasWorkedOutToday = async () => {
  const userId = await requireUser();

  const { data, error } = await hasWorkedOutTodayQuery(userId);

  if (error) throw error;
  return data;
};

export const getNoOfWorkoutsDone = async () => {
  const userId = await requireUser();

  const { data, error } = await getNoOfWorkoutsDoneQuery(userId);

  if (error) throw error;
  return data;
};

export const getNoOfPRs = async () => {
  const userId = await requireUser();

  const { data, error } = await getNoOfPRsQuery(userId);

  if (error) throw error;
  return data;
};

export const getUser = async () => {
  const userId = await requireUser();

  const { data, error } = await getUserQuery(userId);

  if (error) throw error;
  return data;
};

export const getUserAIWorkouts = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev"
) => {
  const userId = await requireUser();

  const { data, error } = await getUserAIWorkoutsQuery(
    userId,
    cursor,
    direction
  );

  if (error) throw error;
  return data;
};

export const getUserPosts = async (userId: string, cursor: Cursor) => {
  const callerId = await requireUser();

  const { data, error } = await getUserPostsQuery(userId, cursor, callerId);

  if (error) throw error;
  return data;
};

export const getFollowingStatus = async (followingId: string) => {
  const followerId = await requireUser();

  const { data, error } = await getFollowingStatusQuery(
    followerId,
    followingId
  );

  if (error) throw error;
  return data;
};

export const updateNotifReadStatus = async (id: string) => {
  const userId = await requireUser();
  const notif = await getNotificationRecipient(id);

  ensureOwnership(notif.data?.recipientid, userId);

  const { data, error } = await updateNotifReadStatusQuery(
    id
  );

  if (error) throw error;
  return data;
};

export const getNotifications = async (
  cursor: { createdAt: Date; id: string } | null
) => {
  const userId = await requireUser();

  const { data, error } = await getNotificationsQuery(
    userId,
    cursor
  );

  if (error) throw error;
  return data;
};

export const getPostsActivity = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev"
) => {
  const userId = await requireUser();

  const { data, error } = await getPostsActivityQuery(
    userId,
    cursor,
    direction
  );

  if (error) throw error;
  return data;
};

export const getPostLikesActivity = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev"
) => {
  const userId = await requireUser();

  const { data, error } = await getPostLikesActivityQuery(
    userId,
    cursor,
    direction
  );

  if (error) throw error;
  return data;
};

export const getCommentLikesActivity = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev"
) => {
  const userId = await requireUser();

  const { data, error } = await getCommentLikesActivityQuery(
    userId,
    cursor,
    direction
  );

  if (error) throw error;
  return data;
};

export const getCommentsActivity = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev"
) => {
  const userId = await requireUser();

  const { data, error } = await getCommentsActivityQuery(
    userId,
    cursor,
    direction
  );

  if (error) throw error;
  return data;
};

export const updateFollow = async (
  notificationId: string,
  followingId: string
) => {
  const followerId = await requireUser();

  await updateFollowQuery(
    notificationId,
    followerId,
    followingId,
  );
};

export const getUnreadNotificationCount = async () => {
  const userId = await requireUser();

  const {data, error} = await getUnreadNotificationCountQuery(userId);

  if(error) throw error;
  return data;
};
