import { useFeed } from "@/hooks/useFeed";
import { useRef, useEffect } from "react";
import Post from "./Post";
import { FeedFetcher } from "@/lib/types";
import { Spinner } from "../ui/spinner";
import PostSkeleton from "./PostSkeleton";
import { getPosts } from "@/lib/actions/community";
import { getUserPosts } from "@/lib/actions/user";

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

  const adaptedGetPosts: FeedFetcher = async ({ cursor, source }) => {
    const res = await getPosts(cursor, source);
    if(res){
      return res;
    }
    throw res;
  };

  const adaptedGetUserPosts: FeedFetcher = async ({ cursor }) => {
    const res = await getUserPosts(specificUserId!, cursor);
    if (res)
      return {
        ...res,
        nextSource: null,
      };
    else throw res;
  };

  const { posts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeed(
      userId,
      type === "general" ? adaptedGetPosts : adaptedGetUserPosts,
      specificUserId
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
    <div className="flex flex-col items-center gap-5">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          userId={userId}
          specificUserId={specificUserId}
        />
      ))}

      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {isFetchingNextPage && (
        <p className="flex-center">
          <Spinner />
        </p>
      )}

      {!isLoading && !hasNextPage && (
        <p className="flex-center">No more Posts</p>
      )}

      <div ref={sentinelRef} className="h-10" />
    </div>
  );
};

export default Feed;
