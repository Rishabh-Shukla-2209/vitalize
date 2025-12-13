import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { FeedFetcher, GetPostsResponse, PageParam } from "@/lib/types";

export const useFeed = (
  userId: string,
  fetcher: FeedFetcher,
  specificUserId?: string,
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery<
    GetPostsResponse,
    Error,
    InfiniteData<GetPostsResponse, PageParam>,
    ["feed", string, string],
    PageParam
  >({
    queryKey: ["feed", specificUserId ? specificUserId : "general", userId],
    queryFn: async ({ pageParam }) => {
      const { cursor, source } = pageParam;
      const res = await fetcher({ userId, cursor, source });
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
    staleTime: Infinity,
  });

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return {
    posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
