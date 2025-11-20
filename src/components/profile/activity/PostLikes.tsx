import Icons from "@/components/icons/appIcons";
import { Button } from "@/components/ui/button";
import { getPostLikesActivity } from "@/lib/queries";
import { minutesAgo } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useState } from "react";
import ActivitySkeleton from "../skeletons/ActivitySkeleton";

const Likes = ({ userId }: { userId: string }) => {
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

    const data = await getPostLikesActivity(userId, cursor, direction);

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
  }, [userId, currIndex, direction, pageCursors]);

  const { data: postLikes, isLoading } = useQuery({
    queryKey: ["activity", "postLikes", userId, currIndex],
    queryFn: getData,
    staleTime: Infinity,
  });
  return (
    <div>
      <h3 className="mb-2">Post Likes</h3>
      <div className="bg-zinc-50 border border-zinc-200 rounded-md">
        {isLoading ? <ActivitySkeleton/> : postLikes && postLikes.length > 0 ? 
          postLikes.map((like) => (
            <div key={like.id} className="border border-b-zinc-100 p-2 flex justify-between items-center text-zinc-600">
              <p>Liked {`${like.post.user.firstName}'s post.`}</p>
              <p className="flex-center">
                <span className="mr-2 text-sm">{minutesAgo(like.createdAt)}</span>
                <Button variant="outline">
                  <Icons.view />
                  <Link href={`/community/post/${like.postid}`}>View</Link>
                </Button>
              </p>
            </div>
          )): <p className="p-2">Your post likes will appear here.</p>}
      </div>
      <div className="flex justify-between">
        <Button
          variant="ghost"
          className="text-red-500 text-center mt-2 cursor-pointer"
          disabled={currIndex < 1}
          onClick={() => {
            setCurrIndex((prev) => prev - 1);
            setDirection("prev");
          }}
        >
        <Icons.left /> Prev</Button>
        <Button
          variant="ghost"
          className="text-red-500 text-center mt-2 cursor-pointer"
          disabled={!postLikes || postLikes.length < 5}
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

export default Likes;
