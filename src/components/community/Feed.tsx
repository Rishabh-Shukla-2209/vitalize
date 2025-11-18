import { useFeed } from "@/hooks/useFeed";
import { useRef, useEffect } from "react";
import Post from "./Post";
import { getPosts, getUserPosts } from "@/lib/queries";
import { FeedFetcher } from "@/lib/types";
import { Spinner } from "../ui/spinner";

const Feed = ({
  userId,
  type,
  specificUserId,
}: {
  userId: string;
  type: "general" | "specific";
  specificUserId?: string;
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const adaptedGetPosts: FeedFetcher = async ({ userId, cursor, source }) => {
    return getPosts(userId, cursor, source);
  };

  const adaptedGetUserPosts: FeedFetcher = async ({
    userId,
    cursor,
  }) => {
    const res = await getUserPosts(specificUserId!, cursor, userId);
    return {
      ...res,
      nextSource: null,
    };
  };

  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed(
    userId,
    type === "general" ? adaptedGetPosts : adaptedGetUserPosts,
    specificUserId,
  );

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="flex flex-col gap-5">
      {posts.map((post) => (
        <Post key={post.id} post={post} userId={userId} specificUserId={specificUserId}/>
      ))}

      {isFetchingNextPage && (
        <p className="flex-center"><Spinner /></p>
      )}

      {!hasNextPage && (
        <p className="flex-center">No more Posts</p>
      )}

      <div ref={sentinelRef} className="h-10" />
    </div>
  );
};

export default Feed;
