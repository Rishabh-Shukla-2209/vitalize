"use client";

import PostWithComments from "@/components/community/PostWithComments";
import { Spinner } from "@/components/ui/spinner";
import {
  getPost,
  saveComment,
  savePostReaction,
} from "@/lib/actions/community";
import { PostType } from "@/lib/types";
import { handleAppError } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { notFound, useParams, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const PostPage = () => {
  const { user } = useUser();
  const { postId } = useParams();
  const searchParams = useSearchParams();
  const commentId = searchParams.get("commentId");
  const [post, setPost] = useState<PostType | null>();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const optimisticLikesCount = post
    ? post._count.PostLike + (liked === post.liked ? 0 : liked ? 1 : -1)
    : 0;

  useEffect(() => {
    const fetchPost = async (postId: string) => {
      try {
        const res = await getPost(postId);
        setPost(res);
        if (res) setLiked(res.liked);
      } catch (err) {
        handleAppError(err);
      }
    };

    if (user && typeof postId === "string") fetchPost(postId);
  }, [postId, user]);

  if (post === null) {
    notFound();
  }

  const updateLikeCommentQueryData = useCallback(
    (target: "like" | "comment", commentsToAdd: number = 1) => {
      setPost((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          liked,
          _count: {
            ...prev._count,
            ...(target === "like" && {
              PostLike:
                prev._count.PostLike +
                (liked === post!.liked ? 0 : liked ? 1 : -1),
            }),
            ...(target === "comment" && {
              Comment: prev._count.Comment + commentsToAdd,
            }),
          },
        };
      });
    },
    [liked, post],
  );

  const addComment = useCallback(
    async (text: string, parentId?: string, parentAuthor?: string) => {
      try {
        updateLikeCommentQueryData("comment");
        const newComment = await saveComment(
          post!.id,
          post!.userid,
          text,
          parentId,
          parentAuthor,
        );
        queryClient.invalidateQueries({
          queryKey: ["activity", "comments"],
          exact: false,
        });
        return newComment;
      } catch (err) {
        handleAppError(err);
        updateLikeCommentQueryData("comment", -1);
        return null;
      }
    },
    [post, queryClient, updateLikeCommentQueryData],
  );

  useEffect(() => {
    if (!user || !post || liked === post.liked) return;

    const timer = setTimeout(() => {
      try {
        savePostReaction(post.id, post.userid, liked ? "liked" : "unliked");
      } catch (err) {
        handleAppError(err);
        return;
      }
      updateLikeCommentQueryData("like");
      queryClient.invalidateQueries({
        queryKey: ["activity", "postLikes"],
        exact: false,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [liked, post, queryClient, updateLikeCommentQueryData, user]);

  return (
    <div className="w-full h-full flex-center py-5">
      {post === undefined ? (
        <div className="w-full h-screen flex-center">
          <Spinner className="mb-50" />
        </div>
      ) : post ? (
        <PostWithComments
          post={post}
          userId={user!.id}
          optimisticLikesCount={optimisticLikesCount}
          liked={liked}
          setLiked={setLiked}
          comment={comment}
          setComment={setComment}
          addComment={addComment}
          updateLikeCommentQueryData={updateLikeCommentQueryData}
          targetCommentId={commentId ?? ""}
        />
      ) : (
        <p>Post Not Found</p>
      )}
    </div>
  );
};

export default PostPage;
