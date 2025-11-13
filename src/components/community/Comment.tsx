import { CommentType, LikeType } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import Icons from "../icons/appIcons";
import { minutesAgo } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { User } from "@/generated/prisma";
import {
  deleteComment,
  getCommentLikes,
  saveCommentReaction,
} from "@/lib/queries";
import Like from "./Like";
import { useQueryClient } from "@tanstack/react-query";

const Comment = ({
  comment,
  setComments,
  userData,
  addComment,
  updateLikeCommentQueryData,
  targetCommentId,
}: {
  comment: CommentType;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  userData: User;
  addComment: (
    text: string,
    parentId?: string
  ) => Promise<Omit<CommentType, "user" | "_count" | "liked">>;
  updateLikeCommentQueryData: (
    target: "like" | "comment",
    commentsToAdd?: number
  ) => void;
  targetCommentId?: string;
}) => {
  const [liked, setLiked] = useState(comment.liked);
  const [viewReplies, setViewReplies] = useState(false);
  const [likes, setLikes] = useState<LikeType[]>([]);
  const [open, setOpen] = useState(false);
  const [addReply, setAddReply] = useState(false);
  const [reply, setReply] = useState("");
  const [addingReply, setAddingReply] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const queryClient = useQueryClient();

  const isTarget = comment.id === targetCommentId;

  const addReplyToTree = (
    comments: CommentType[],
    parentId: string,
    reply: CommentType
  ): CommentType[] => {
    return comments.map((c) => {
      // Direct parent found
      if (c.id === parentId) {
        return {
          ...c,
          replies: [...(c.replies ?? []), reply],
        };
      }

      if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: addReplyToTree(c.replies, parentId, reply),
        };
      }

      return c;
    });
  };

  const saveComment = async (text: string) => {
    setAddingReply(true);

    const newComment = await addComment(text, comment.id);

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

    setComments((prev) => addReplyToTree(prev, comment.id, formattedComment));
    setAddingReply(false);
    setReply("");
    setAddReply(false);
    setViewReplies(true);
  };

  const removeCommentFromTree = (
    tree: CommentType[],
    targetId: string
  ): { newTree: CommentType[]; deletedCount: number } => {
    let deletedCount = 0;

    const walk = (nodes: CommentType[]): CommentType[] => {
      const result = [];

      for (const node of nodes) {
        if (node.id === targetId) {
          // Count this node + all its nested replies
          deletedCount += 1 + countReplies(node);
          continue; // don't include this node in the result
        }

        // If it has replies, process them
        let newNode = node;
        if (node.replies && node.replies.length > 0) {
          const updatedReplies = walk(node.replies);
          newNode = { ...node, replies: updatedReplies };
        }

        result.push(newNode);
      }

      return result;
    };

    const newTree = walk(tree);
    return { newTree, deletedCount };
  };

  function countReplies(node: CommentType) {
    if (!node.replies || node.replies.length === 0) return 0;

    let total = node.replies.length;
    for (const r of node.replies) {
      total += countReplies(r);
    }
    return total;
  }

  const removeComment = async () => {
    setDeleting(true);
    let noOfDeletedComments = 0;

    setComments((prev) => {
      const { newTree, deletedCount } = removeCommentFromTree(prev, comment.id);
      noOfDeletedComments = deletedCount;
      return newTree;
    });

    updateLikeCommentQueryData("comment", -noOfDeletedComments);
    await deleteComment(comment.id);
  };

  const updateCommentLike = useCallback(
    (tree: CommentType[], id: string, liked: boolean): CommentType[] => {
      return tree.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            liked,
            _count: {
              ...c._count,
              CommentLike: liked
                ? c._count.CommentLike + 1
                : c._count.CommentLike - 1,
            },
          };
        }

        if (c.replies?.length) {
          return {
            ...c,
            replies: updateCommentLike(c.replies, id, liked),
          };
        }

        return c;
      });
    },
    []
  );

  useEffect(() => {
    if (liked === comment.liked) return;

    const timer = setTimeout(() => {
      saveCommentReaction(comment.id, userData.id, liked ? "liked" : "unliked");
      setComments((prev) => updateCommentLike(prev, comment.id, liked));
      queryClient.invalidateQueries({
        queryKey: ["activity", "commentLikes"],
        exact: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    comment.id,
    comment.liked,
    liked,
    queryClient,
    setComments,
    updateCommentLike,
    userData.id,
  ]);

  useEffect(() => {
    const getLikes = async () => {
      const data = await getCommentLikes(comment.id);
      setLikes(data);
    };

    if (open && likes.length === 0) getLikes();
  }, [comment.id, likes.length, open]);

  const containsComment = useCallback(
    (comment: CommentType, targetId: string): boolean => {
      if (comment.id === targetId) return true;
      return (
        comment.replies?.some((r) => containsComment(r, targetId)) || false
      );
    },
    []
  );

  useEffect(() => {
    if (
      targetCommentId &&
      comment.replies?.some((r) => containsComment(r, targetCommentId))
    ) {
      setViewReplies(true);
    }
  }, [comment, containsComment, targetCommentId]);

  useEffect(() => {
    if (isTarget) {
      const el = document.getElementById(comment.id);
      if (el) {
        const scrollTimer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlight(true);

          const highlightTimer = setTimeout(() => setHighlight(false), 2000);

          return () => clearTimeout(highlightTimer);
        }, 500);

        return () => clearTimeout(scrollTimer);
      }
    }
  }, [comment.id, isTarget]);

  return (
    <div className="flex flex-col gap-2" id={comment.id}>
      <div
        className={clsx(
          "flex gap-1 py-1 border-b border-b-zinc-300 transition-colors duration-700",
          { "bg-yellow-100 border-amber-600": highlight }
        )}
      >
        <Link
          href={`/community/user/${comment.userid}`}
          className="cursor-pointer"
        >
          {comment.user.imgUrl ? (
            <Image
              src={comment.user.imgUrl}
              alt="user profile image"
              width={50}
              height={50}
              className="rounded-4xl"
            />
          ) : (
            <Icons.user width={30} height={30} />
          )}
        </Link>
        <div className="flex flex-col flex-1 max-w-full overflow-x-hidden">
          <p className="text-zinc-600 break-words">
            <span className="cursor-pointer font-semibold">
              <Link href={`/community/user/${comment.userid}`}>
                {comment.user.firstName} {comment.user.lastName}{" "}
              </Link>
            </span>
            {comment.text}
          </p>
          <p className="text-zinc-600 text-sm flex gap-2">
            <span>{minutesAgo(comment.createdAt)}</span>
            {comment._count.CommentLike > 0 && (
              <span className="cursor-pointer" onClick={() => setOpen(true)}>
                {comment._count.CommentLike} likes
              </span>
            )}
            {comment.replies!.length > 0 && (
              <span
                onClick={() => setViewReplies((prev) => !prev)}
                className="cursor-pointer"
              >
                {" "}
                Replies
              </span>
            )}
            <span className="cursor-pointer" onClick={() => setAddReply(true)}>
              Reply
            </span>
          </p>
        </div>
        {!deleting && (
          <>
            <span
              onClick={() => setLiked((prev) => !prev)}
              className="flex-center cursor-pointer mr-1"
            >
              <Icons.like
                className={clsx({ "text-primary-dark": liked })}
                fill={liked ? "#38e07b" : "transparent"}
                size={20}
              />
            </span>
            {comment.userid === userData.id && (
              <span className="flex-center cursor-pointer">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span onClick={removeComment} className="text-sm">
                      <Icons.delete className="text-red-500" size={20} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Comment</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            )}
          </>
        )}
      </div>
      {viewReplies && (
        <div className="ml-3 border-l border-l-zinc-300">
          {comment.replies &&
            comment.replies.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                setComments={setComments}
                userData={userData}
                addComment={addComment}
                updateLikeCommentQueryData={updateLikeCommentQueryData}
                targetCommentId={targetCommentId}
              />
            ))}
        </div>
      )}
      {addReply && (
        <div className="flex justify-between ml-3 border-l border-l-zinc-300">
          <input
            type="text"
            placeholder="Add a reply..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full bg-zinc-200 border-0 px-0.5 text-sm flex-1"
          />
          {reply && (
            <Button
              variant="ghost"
              className="hover:bg-white"
              onClick={() => {
                saveComment(reply);
                setReply("");
              }}
              disabled={addingReply}
            >
              {addingReply ? <Spinner /> : <Icons.send />}
            </Button>
          )}
          <Button
            variant="ghost"
            className="hover:bg-white"
            onClick={() => setAddReply(false)}
            disabled={addingReply}
          >
            <Icons.uncheck />
          </Button>
        </div>
      )}
      {open && (
        <div
          className="fixed w-full h-full bg-black/70 top-0 left-0 flex-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-zinc-200 border border-zinc-400 w-120 max-h-100 overflow-scroll rounded-lg p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex border-b-2 border-b-zinc-400 pb-1">
              <Icons.uncheck
                onClick={() => setOpen(false)}
                className="cursor-pointer"
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
    </div>
  );
};

export default Comment;
