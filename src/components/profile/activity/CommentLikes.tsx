import Icons from "@/components/icons/appIcons";
import { Button } from "@/components/ui/button";
import { getCommentLikesActivity } from "@/lib/actions/user";
import { minutesAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useState } from "react";
import ActivitySkeleton from "../skeletons/ActivitySkeleton";

const CommentLikes = ({ userId }: { userId: string }) => {
  const [pageCursors, setPageCursors] = useState<
    Array<{
      first: { createdAt: Date; id: string } | null;
      last: { createdAt: Date; id: string } | null;
    }>
  >([{ first: null, last: null }]);
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const getData = useCallback(async () => {
    const cursor =
      direction === "prev"
        ? pageCursors[currIndex].first
        : pageCursors[currIndex].last;

    const data = await getCommentLikesActivity(cursor, direction);
    if (!data) return;
    if (data.length > 0) {
      setPageCursors((prev) => {
        const next = [...prev];
        next[currIndex + 1] = {
          first: { createdAt: data[0].createdAt, id: data[0].id },
          last: {
            createdAt: data[data.length - 1].createdAt,
            id: data[data.length - 1].id,
          },
        };
        return next;
      });
    }

    return data;
  }, [currIndex, direction, pageCursors]);

  const { data: commentLikes, isLoading } = useQuery({
    queryKey: ["activity", "commentLikes", userId, currIndex],
    queryFn: getData,
    staleTime: Infinity,
  });
  return (
    <div>
      <h3 className="mb-2">Comment Likes</h3>
      <div className="bg-zinc-50 dark:bg-sage-400 border border-zinc-200 dark:border-sage-700 overflow-cliprounded-md">
        {isLoading ? (
          <ActivitySkeleton />
        ) : commentLikes && commentLikes.length > 0 ? (
          commentLikes.map((like) => (
            <div
              key={like.id}
              className="border border-b-zinc-100 dark:border-sage-700 p-2 flex justify-between items-center text-zinc-600"
            >
              <p>Liked {`${like.comment.user.firstName}'s comment.`}</p>
              <p className="flex-center">
                <span className="mr-2 text-sm">
                  {minutesAgo(like.createdAt)}
                </span>
                <Button variant="outline">
                  <Icons.view />
                  <Link
                    href={`/community/post/${like.comment.postid}?commentId=${like.commentid}`}
                  >
                    View
                  </Link>
                </Button>
              </p>
            </div>
          ))
        ) : (
          <p className="p-2">Your comment likes will appear here.</p>
        )}
      </div>
      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="text-primary text-center mt-2 cursor-pointer"
          disabled={currIndex < 1}
          onClick={() => {
            setCurrIndex((prev) => prev - 1);
            setDirection("prev");
          }}
        >
          <Icons.left /> Prev
        </Button>
        <Button
          variant="ghost"
          className="text-primary text-center mt-2 cursor-pointer"
          disabled={!commentLikes || commentLikes.length < 5}
          onClick={() => {
            setCurrIndex((prev) => prev + 1);
            setDirection("next");
          }}
        >
          Next <Icons.right />
        </Button>
      </div>
    </div>
  );
};

export default CommentLikes;
