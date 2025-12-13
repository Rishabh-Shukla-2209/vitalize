import { renderHook, waitFor } from "@testing-library/react";
import { useFeed } from "../useFeed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { GetPostsResponse } from "@/lib/types";
import React from "react";

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";
  return Wrapper;
};

describe("useFeed Hook", () => {
  it("fetches and returns posts", async () => {
    const mockPosts: GetPostsResponse = {
      posts: [
        {
          id: "1",
          title: "Test Post",
          body: "Body",
          userid: "u1",
          createdAt: new Date(),
          privacy: "PUBLIC",
          liked: false,
          _count: { Comment: 0, PostLike: 0 },
          user: {
            id: "u1",
            firstName: "John",
            lastName: "Doe",
            imgUrl: null,
            privacy: "PUBLIC",
          },
          workoutLogid: null,
          imgUrl: null,
        },
      ],
      cursor: { id: "1", createdAt: new Date() },
      nextSource: "public",
    };

    const mockFetcher = vi.fn().mockResolvedValue(mockPosts);

    const { result } = renderHook(() => useFeed("user1", mockFetcher), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.posts).toEqual([]);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0].title).toBe("Test Post");
    expect(mockFetcher).toHaveBeenCalledWith({
      userId: "user1",
      cursor: null,
      source: "friends", // initial page param
    });
  });

  it("handles fetchNextPage", async () => {
    const page1: GetPostsResponse = {
      posts: [
        {
          id: "1",
          title: "Post 1",
          body: "",
          userid: "u1",
          createdAt: new Date(),
          privacy: "PUBLIC",
          liked: false,
          _count: { Comment: 0, PostLike: 0 },
          user: {
            id: "u1",
            firstName: "",
            lastName: "",
            imgUrl: null,
            privacy: "PUBLIC",
          },
          workoutLogid: null,
          imgUrl: null,
        },
      ],
      cursor: { id: "1", createdAt: new Date() },
      nextSource: null, // stop pagination for test simplicity? No, let's allow next
    };
    // Actually useFeed logic:
    // getNextPageParam: (lastPage) => if (!lastPage.cursor || !lastPage.nextSource) return undefined;

    const page1WithNext: GetPostsResponse = {
      ...page1,
      nextSource: "public",
    };

    const page2: GetPostsResponse = {
      posts: [
        {
          id: "2",
          title: "Post 2",
          body: "",
          userid: "u1",
          createdAt: new Date(),
          privacy: "PUBLIC",
          liked: false,
          _count: { Comment: 0, PostLike: 0 },
          user: {
            id: "u1",
            firstName: "",
            lastName: "",
            imgUrl: null,
            privacy: "PUBLIC",
          },
          workoutLogid: null,
          imgUrl: null,
        },
      ],
      cursor: null,
      nextSource: null,
    };

    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce(page1WithNext)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useFeed("user1", mockFetcher), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.posts).toHaveLength(1);

    // Trigger next page
    await result.current.fetchNextPage();

    await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false));

    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[1].title).toBe("Post 2");
  });
});
