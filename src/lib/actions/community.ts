"use server";

import { GetPostsResponse, PrivacyType, Source } from "../types";
import { ensureOwnership, ensurePostAccessibility, requireUser } from "../auth";
import {
  createPostQuery,
  deleteCommentQuery,
  getCommentLikesQuery,
  getCommentOwner,
  getCommentsQuery,
  getPostLikesQuery,
  getPostQuery,
  getPostsQuery,
  getSuggestionsQuery,
  saveCommentQuery,
  saveCommentReactionQuery,
  saveFollowingQuery,
  savePostReactionQuery,
  searchUsersQuery,
} from "../queries/community";
import { postSchema } from "@/validations/post";
import { ValidationError } from "../errors";

export const getPosts = async (
  cursor: { createdAt: Date; id: string } | null,
  source: Source
) => {
  const userId = await requireUser();

  const { data, error } = await getPostsQuery(userId, cursor, source);

  if (error) throw error;
  return data as GetPostsResponse;
};

export const savePostReaction = async (
  postId: string,
  authorId: string,
  reaction: "liked" | "unliked"
) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const { data, error } = await savePostReactionQuery(
    postId,
    authorId,
    userId,
    reaction
  );

  if (error) throw error;
  return data;
};

export const saveComment = async (
  postId: string,
  authorId: string,
  text: string,
  parentId?: string,
  parentAuthorId?: string
) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const { data, error } = await saveCommentQuery(
    postId,
    authorId,
    userId,
    text,
    parentId,
    parentAuthorId
  );

  if (error) throw error;
  return data;
};

export const saveFollowing = async (
  followingId: string,
  followingPrivacy: PrivacyType,
  action: "follow" | "unFollow"
) => {
  const userId = await requireUser();

  const { data, error } = await saveFollowingQuery(
    userId,
    followingId,
    followingPrivacy,
    action
  );

  if (error) throw error;
  return data;
};

export const getPostLikes = async (postId: string) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const { data, error } = await getPostLikesQuery(postId);

  if (error) throw error;
  return data;
};

export const getComments = async (postId: string) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const { data, error } = await getCommentsQuery(userId, postId);

  if (error) throw error;
  return data;
};

export const saveCommentReaction = async (
  commentId: string,
  commentAuthorId: string,
  postId: string,
  reaction: "liked" | "unliked"
) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const { data, error } = await saveCommentReactionQuery(
    commentId,
    commentAuthorId,
    postId,
    userId,
    reaction
  );

  if (error) throw error;
  return data;
};

export const getCommentLikes = async (commentId: string) => {
  await requireUser();

  const { data, error } = await getCommentLikesQuery(commentId);

  if (error) throw error;
  return data;
};

export const deleteComment = async (id: string) => {
  const userId = await requireUser();
  const { data: commentAuthorId, error } = await getCommentOwner(id);
  if (error) throw error;
  ensureOwnership(commentAuthorId, userId);

  const { error: deletionError } = await deleteCommentQuery(id);

  if (deletionError) throw deletionError;
};

export const getSuggestions = async (excludeList: string[]) => {
  await requireUser();

  const { data, error } = await getSuggestionsQuery(excludeList);

  if (error) throw error;
  return data;
};

export const searchUsers = async (search: string) => {
  const userId = await requireUser();

  const { data, error } = await searchUsersQuery(userId, search);

  if (error) throw error;
  return data;
};

export const createPost = async (postData: {
  title: string;
  privacy: PrivacyType;
  body?: string;
  imgUrl?: string;
  workoutLogid?: string;
}) => {
  const userId = await requireUser();

  const parsed = postSchema.safeParse(postData);

  if (!parsed.success) {
    throw new ValidationError("Invalid post payload", {
      cause: parsed.error.issues,
    });
  }

  const {error} = await createPostQuery(userId, parsed.data);

  if(error) throw error;
};

export const getPost = async (postId: string) => {
  const userId = await requireUser();
  await ensurePostAccessibility(postId, userId);

  const {data, error} = await getPostQuery(postId, userId);

  if(error) throw error;
  return data;
};
