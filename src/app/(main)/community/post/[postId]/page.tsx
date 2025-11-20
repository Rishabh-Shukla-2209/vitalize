"use client"

import PostWithComments from "@/components/community/PostWithComments";
import { Spinner } from "@/components/ui/spinner";
import { getPost, saveComment, savePostReaction } from "@/lib/queries";
import { PostType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams} from "next/navigation";
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
    const fetchPost = async (postId: string, userId: string) => {
      const res = await getPost(postId, userId);
      setPost(res);
      if (res) setLiked(res.liked);      
    };

    if (user && typeof postId === "string") fetchPost(postId, user.id);    
  }, [postId, user]);

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
    [liked, post]
  );

  const addComment = useCallback(
    async (text: string, parentId?: string, parentAuthor?: string) => {
      updateLikeCommentQueryData("comment");
      const newComment = await saveComment(post!.id, post!.userid, user!.id, text, parentId, parentAuthor);
      queryClient.invalidateQueries({
      queryKey: ["activity", "comments"],
      exact: false
    })
      return newComment;
    },
    [post, queryClient, updateLikeCommentQueryData, user]
  );

  useEffect(() => {
      if (!user || !post || liked === post.liked) return;
  
      const timer = setTimeout(() => {
        savePostReaction(post.id, post.userid, user.id, liked ? "liked" : "unliked");
        updateLikeCommentQueryData("like");
        queryClient.invalidateQueries({
        queryKey: ["activity", "postLikes"],
        exact: false
      })
      }, 2000);
  
      return () => clearTimeout(timer);
    }, [liked, post, queryClient, updateLikeCommentQueryData, user]);

  return (
    <div className="w-full h-full flex-center py-5">
      {post === undefined ? (
        <div className="w-full h-screen flex-center"><Spinner className="mb-50"/></div>
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
