import { GetPostsResponse, LikeType, PageParam, PostType } from "@/lib/types";
import Icons from "../icons/appIcons";
import Image from "next/image";
import { handleAppError, timeAgo } from "@/lib/utils";
import { Button } from "../ui/button";
import WorkoutSummary from "./WorkoutSummary";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
  getPostLikes,
  saveComment,
  savePostReaction,
} from "@/lib/actions/community";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Like from "./Like";
import PostWithComments from "./PostWithComments";
import { useKeyboardAvoidance } from "@/hooks/useKeyboardAvoidance";

const Post = ({
  post,
  userId,
  specificUserId,
}: {
  post: PostType;
  userId: string;
  specificUserId?: string;
}) => {
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(post.liked);
  const [open, setOpen] = useState<"likes" | "comments" | "none">("none");
  const [likes, setLikes] = useState<LikeType[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  useKeyboardAvoidance(inputRef);

  const queryClient = useQueryClient();
  const optimisticLikesCount =
    post._count.PostLike + (liked === post.liked ? 0 : liked ? 1 : -1);

  const updateLikeCommentQueryData = useCallback(
    (target: "like" | "comment", commentsToAdd: number = 1) => {
      const updateData = (
        oldData:
          | { pages: GetPostsResponse[]; pageParams: PageParam[] }
          | undefined,
      ) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === post.id
                ? {
                    ...p,
                    liked,
                    _count: {
                      ...p._count,
                      ...(target === "like" && {
                        PostLike:
                          p._count.PostLike +
                          (liked === post.liked ? 0 : liked ? 1 : -1),
                      }),
                      ...(target === "comment" && {
                        Comment: p._count.Comment + commentsToAdd,
                      }),
                    },
                  }
                : p,
            ),
          })),
        };
      };

      queryClient.setQueryData(
        ["feed", specificUserId ? specificUserId : "general", userId],
        updateData,
      );

      if (specificUserId) {
        queryClient.setQueryData(["feed", "general", userId], updateData);
      }
    },
    [liked, post.id, post.liked, queryClient, specificUserId, userId],
  );

  useEffect(() => {
    if (liked === post.liked) return;

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
  }, [
    liked,
    post.id,
    post.liked,
    post.userid,
    queryClient,
    updateLikeCommentQueryData,
    userId,
  ]);

  const addComment = useCallback(
    async (text: string, parentId?: string, parentAuthor?: string) => {
      try {
        updateLikeCommentQueryData("comment");
        const newComment = await saveComment(
          post.id,
          post.userid,
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
    [post.id, post.userid, queryClient, updateLikeCommentQueryData],
  );

  useEffect(() => {
    const getLikes = async () => {
      try {
        const data = await getPostLikes(post.id);
        setLikes(data!);
      } catch (err) {
        handleAppError(err);
      }
    };

    if (open === "likes" && likes.length === 0) getLikes();
  }, [likes.length, open, post.id]);

  return (
    <div className="flex justify-between flex-col bg-zinc-100 dark:bg-sage-400 rounded-md p-5 min-h-160 min-w-95 max-w-95 lg:min-w-125 lg:max-w-125">
      <Link
        href={`/community/user/${post.userid}`}
        className={clsx("flex gap-3 items-center cursor-pointer", {
          "pointer-events-none": specificUserId,
        })}
      >
        {post.user.imgUrl ? (
          <Image
            src={post.user.imgUrl}
            alt="user profile image"
            width={60}
            height={60}
            className="rounded-4xl"
          />
        ) : (
          <Icons.user width={30} height={30} />
        )}
        <div className="flex flex-col">
          <p className="font-semibold">
            {post.user.firstName} {post.user.lastName}
          </p>
          <p>Posted {timeAgo(post.createdAt)}</p>
        </div>
      </Link>
      <div className="flex flex-col flex-1 gap-2 mt-5">
        <p className="font-semibold">{post.title}</p>
        <p>{post.body}</p>
        {post.workoutLog && <WorkoutSummary workout={post.workoutLog} />}
        {post.imgUrl && (
          <div className="relative h-60 min-h-120 w-full rounded-md overflow-hidden px-3 mt-2">
            <Image
              src={post.imgUrl}
              alt="Post Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
      <div className="flex gap-3 justify-between text-zinc-600 text-sm font-semibold mt-5">
        <p className="flex gap-1  cursor-pointer">
          <span onClick={() => setLiked((prev) => !prev)}>
            <Icons.like
              className={clsx({ "text-primary": liked })}
              fill={liked ? "#38e07b" : "transparent"}
            />
          </span>
          <span onClick={() => setOpen("likes")}>
            {optimisticLikesCount} Likes
          </span>
        </p>
        <p
          className="flex gap-1 cursor-pointer"
          onClick={() => setOpen("comments")}
        >
          <span>
            <Icons.comment className="hover:text-black" />
          </span>
          {post._count.Comment} Comments
        </p>
      </div>
      <div className="flex justify-between">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-zinc-100 dark:bg-sage-400 border-0 px-0 py-0.1 text-sm mt-1 flex-1"
        />
        {comment && (
          <Button
            variant="ghost"
            className="hover:bg-white"
            onClick={() => {
              addComment(comment);
              setComment("");
            }}
          >
            <Icons.send />
          </Button>
        )}
      </div>
      {open !== "none" && (
        <div
          className="fixed w-full h-full bg-black/70 top-0 left-0 flex-center"
          onClick={() => setOpen("none")}
        >
          {open === "likes" && (
            <div
              className="bg-zinc-200 dark:bg-sage-400 border border-zinc-400 dark:border-sage-700 w-120 max-h-100 overflow-scroll rounded-lg p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex border-b-2 border-b-zinc-400 dark:border-b-sage-700 pb-1">
                <Icons.uncheck
                  onClick={() => setOpen("none")}
                  className="cursor-pointer dark:text-sage-200"
                />
                <h3 className="flex-1 text-center">Likes</h3>
              </div>
              <div className="flex flex-col w-full">
                {likes.length > 0 ? (
                  likes.map((like) => <Like key={like.id} like={like} />)
                ) : (
                  <p>No likes to show</p>
                )}
              </div>
            </div>
          )}

          {open === "comments" && (
            <>
              <Icons.uncheck
                color="#38e07b"
                size={30}
                onClick={() => setOpen("none")}
                className="fixed right-5 top-4 cursor-pointer"
              />
              <PostWithComments
                post={post}
                userId={userId}
                comment={comment}
                liked={liked}
                setLiked={setLiked}
                setComment={setComment}
                addComment={addComment}
                optimisticLikesCount={optimisticLikesCount}
                updateLikeCommentQueryData={updateLikeCommentQueryData}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
