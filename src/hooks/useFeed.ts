import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "@/lib/queries";
import { GetPostsResponse, PageParam } from "@/lib/types";

export const useFeed = (userId: string) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    GetPostsResponse,
    Error,
    InfiniteData<GetPostsResponse, PageParam>,
    ["feed", string],
    PageParam
  >({
    queryKey: ["feed", userId],
    queryFn: async ({ pageParam }) => {
      const { cursor, source } = pageParam;
      const res = await getPosts(userId, cursor, source);
      return res;
    },
    initialPageParam: { cursor: null, source: "friends" },
    
    getNextPageParam: (lastPage) => {
      if (!lastPage.cursor || !lastPage.nextSource) return undefined;
      return {
        cursor: lastPage.cursor,
        source: lastPage.nextSource,
      };
    },
  });

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};