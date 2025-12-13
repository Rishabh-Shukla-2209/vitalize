import { CommentType, LikeType, PostType } from "@/lib/types";
import WorkoutSummary from "./WorkoutSummary";
import Link from "next/link";
import Image from "next/image";
import { handleAppError, timeAgo } from "@/lib/utils";
import Icons from "../icons/appIcons";
import clsx from "clsx";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getComments, getPostLikes } from "@/lib/actions/community";
import { getUser } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import Like from "./Like";
import { Spinner } from "../ui/spinner";
import { useKeyboardAvoidance } from "@/hooks/useKeyboardAvoidance";

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
    parentId?: string,
    parentAuthor?: string,
  ) => Promise<Omit<CommentType, "user" | "_count" | "liked"> | null>;
  updateLikeCommentQueryData: (
    target: "like" | "comment",
    commentsToAdd?: number,
  ) => void;
  targetCommentId?: string;
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState<LikeType[]>([]);
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  useKeyboardAvoidance(inputRef);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(post.id);
        setComments(data!);
      } catch (err) {
        handleAppError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [post.id, userId]);

  const { data: userData } = useQuery({
    queryKey: ["user", { userId }],
    queryFn: () => getUser(),
    staleTime: Infinity,
  });

  useEffect(() => {
    const getLikes = async () => {
      try {
        const data = await getPostLikes(post.id);
        setLikes(data!);
      } catch (err) {
        handleAppError(err);
      }
    };

    if (open && likes.length === 0) getLikes();
  }, [likes.length, open, post.id]);

  const saveComment = async (text: string) => {
    const newComment = await addComment(text);
    if (!newComment) return;
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
      className="
        flex flex-col md:flex-row 
        bg-zinc-100 dark:bg-sage-400 rounded-md 
        max-h-[85vh] overflow-y-auto 
        md:min-h-175 md:max-h-175 md:max-w-225 md:overflow-visible
        pb-5 md:pb-0
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col max-w-125 gap-3 p-10">
        <p className="font-semibold">{post.title}</p>
        <p className="mb-5">{post.body}</p>
        {post.workoutLog && <WorkoutSummary workout={post.workoutLog} />}
        {post.imgUrl && (
          <div className="relative w-full h-60 min-h-60 md:h-auto md:min-h-120 rounded-md overflow-hidden">
            <Image
              src={post.imgUrl}
              alt="Post Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col self-center md:self-auto justify-between w-90 md:w-100 bg-zinc-200 dark:bg-sage-500 p-2 rounded-md">
        <Link
          href={`/community/user/${post.userid}`}
          className="flex gap-3 items-center cursor-pointer pb-2 border-b border-b-zinc-400 dark:border-b-sage-700"
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
            <p className="font-semibold">
              {post.user.firstName} {post.user.lastName}
            </p>
            <p>Posted {timeAgo(post.createdAt)}</p>
          </div>
        </Link>
        <div className="flex-1 overflow-y-auto max-h-60 md:max-h-none md:overflow-scroll">
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
          ) : loading ? (
            <div className="w-full h-full flex-center">
              <Spinner />
            </div>
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
                className={clsx({ "text-primary": liked })}
                fill={liked ? "#38e07b" : "transparent"}
              />
            </span>
            <span onClick={() => setOpen(true)} className="cursor-pointer">
              {optimisticLikesCount} Likes
            </span>
          </p>
          {open && (
            <div
              className="fixed w-full h-full bg-black/70 top-0 left-0 flex-center"
              onClick={() => setOpen(false)}
            >
              <div
                className="bg-zinc-200 dark:bg-sage-400 border border-zinc-400 dark:border-sage-700 w-80 md:w-120 max-h-100 overflow-scroll rounded-lg p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex border-b-2 border-b-zinc-400 dark:border-b-sage-700 pb-1">
                  <Icons.uncheck
                    onClick={() => setOpen(false)}
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
            </div>
          )}
          <p className="flex gap-1">
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
            className="w-full bg-zinc-200 dark:bg-sage-500 border-0 px-0.5 text-sm flex-1"
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
