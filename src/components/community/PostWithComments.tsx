import { CommentType, PostType } from "@/lib/types";
import WorkoutSummary from "./WorkoutSummary";
import Link from "next/link";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import Icons from "../icons/appIcons";
import clsx from "clsx";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getComments, getUser } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

const PostWithComments = ({
  post,
  userId,
  optimisticLikesCount,
  liked,
  setLiked,
  comment,
  setComment,
  addComment,
  updateLikeCommentQueryData,
  targetCommentId,
}: {
  post: PostType;
  userId: string;
  optimisticLikesCount: number;
  liked: boolean;
  setLiked: Dispatch<SetStateAction<boolean>>;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (
    text: string,
    parentId?: string
  ) => Promise<Omit<CommentType, "user" | "_count" | "liked">>;
  updateLikeCommentQueryData: (
    target: "like" | "comment",
    commentsToAdd?: number
  ) => void;
  targetCommentId?: string
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getComments(userId, post.id);
      setComments(data);
    };

    fetchComments();
  }, [post.id, userId]);

  const { data: userData } = useQuery({
    queryKey: ["user", { userId }],
    queryFn: () => getUser(userId),
    staleTime: Infinity,
  });

  const saveComment = async (text: string) => {
    const newComment = await addComment(text);
    setComment("");
    const formattedComment: CommentType = {
      ...newComment,
      replies: [],
      _count: { CommentLike: 0 },
      liked: false,
      user: {
        id: userData!.id,
        firstName: userData!.firstName,
        lastName: userData!.lastName,
        imgUrl: userData!.imgUrl,
      },
    };

    setComments((prev) => [formattedComment, ...prev]);
  };

  return (
    <div
      className="flex rounded-md bg-zinc-100 min-h-175 max-h-175 w-225"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col w-125 gap-3 p-10">
        <p className="text-zinc-600 font-semibold">{post.title}</p>
        <p className="text-zinc-600 mb-5">{post.body}</p>
        {post.workoutLog && <WorkoutSummary workout={post.workoutLog} />}
      </div>
      <div className="flex flex-col justify-between w-100 bg-zinc-200 p-2 rounded-md">
        <Link
          href={`/community/user/${post.userid}`}
          className="flex gap-3 items-center cursor-pointer pb-2 border-b border-b-zinc-400"
        >
          {post.user.imgUrl ? (
            <Image
              src={post.user.imgUrl}
              alt="user profile image"
              width={50}
              height={50}
              className="rounded-4xl"
            />
          ) : (
            <Icons.user width={30} height={30} />
          )}
          <div className="flex flex-col">
            <p className="text-zinc-600 font-semibold">
              {post.user.firstName} {post.user.lastName}
            </p>
            <p className="text-zinc-600">Posted {timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        <div className="flex-1 overflow-scroll">
          {comments.length > 0 && userData ? (
            comments.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                setComments={setComments}
                userData={userData}
                addComment={addComment}
                updateLikeCommentQueryData={updateLikeCommentQueryData}
                targetCommentId={targetCommentId}
              />
            ))
          ) : (
            <p>No comments to show</p>
          )}
        </div>
        <div className="flex gap-3 justify-between text-zinc-600 text-sm font-semibold mt-5">
          <p className="flex gap-1">
            <span
              onClick={() => setLiked((prev) => !prev)}
              className="cursor-pointer"
            >
              <Icons.like
                className={clsx({ "text-primary-dark": liked })}
                fill={liked ? "#38e07b" : "transparent"}
              />
            </span>
            <span>{optimisticLikesCount} Likes</span>
          </p>
          <p className="flex gap-1">
            <span>
              <Icons.comment className="hover:text-black" />
            </span>
            {post._count.Comment} Comments
          </p>
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-zinc-200 border-0 px-0.5 text-sm flex-1"
          />
          {comment && (
            <Button
              variant="ghost"
              className="hover:bg-white"
              onClick={() => saveComment(comment)}
            >
              <Icons.send />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostWithComments;
