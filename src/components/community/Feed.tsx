import { useFeed } from "@/hooks/useFeed";
import { useRef, useEffect } from "react";
import Post from "./Post";

const Feed = ({ userId }: { userId: string }) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeed(userId);

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
        <Post key={post.id} post={post} userId={userId} />
      ))}

      {isFetchingNextPage && (
        <p className="text-center text-gray-500">Loading...</p>
      )}

      {!hasNextPage && <p className="flex-center text-zinc-600">No more Posts</p>}

      <div ref={sentinelRef} className="h-10" />
    </div>
  );
};

export default Feed;
