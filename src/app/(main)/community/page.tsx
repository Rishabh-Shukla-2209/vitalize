"use client";

import Feed from "@/components/community/Feed";
import UserInfo from "@/components/community/UserInfo";
import Icons from "@/components/icons/appIcons";
import ActivitySkeleton from "@/components/profile/skeletons/ActivitySkeleton";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma";
import { getSuggestions, searchUsers } from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

const CommunityPage = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchUsers = async (userId: string) => {
      const res = await searchUsers(userId, debouncedSearch);
      setSearchedUsers(res);
    };

    if (user && debouncedSearch) fetchUsers(user.id);
    if (!debouncedSearch) setSearchedUsers([]);
  }, [user, debouncedSearch]);

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["suggestions", { userId: user?.id }],
    queryFn: async () => {
      const existingSuggestions = JSON.parse(
        localStorage.getItem("suggestions") || "[]"
      );
      if (Array.isArray(existingSuggestions)) {
        existingSuggestions.push(user!.id);
        const res = await getSuggestions(existingSuggestions);
        localStorage.setItem("suggestions", JSON.stringify(res));
        return res;
      }
    },
    staleTime: 30 * 60 * 1000,
  });

  return (
    <div className="flex flex-col items-center xl:flex-row xl:justify-around xl:items-start mt-5 w-full px-5">
      <div>
        <div className="flex xl:hidden justify-center gap-5 w-full mb-5">
          <Button
            variant="secondary"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <Icons.userSearch /> Search
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowSuggestions((prev) => !prev)}
          >
            <Icons.userSuggestion /> Suggestions
          </Button>
          <Link href="/community/create-post">
            <Button
              variant="secondary"
            >
              <Icons.share /> Share
            </Button>
          </Link>
        </div>
        <p
          className={clsx(
            "items-center text-zinc-400 bg-zinc-100 dark:bg-sage-400 px-2.5 rounded-lg w-full xl:w-85 mb-5",
            showSearch ? "flex" : "hidden xl:flex"
          )}
        >
          <Icons.search />
          <input
            type="text"
            className="border-0 bg-zinc-100 dark:bg-sage-400 text-zinc-600 dark:text-zinc-100 flex-1"
            placeholder="Search for a friend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </p>
        {searchedUsers.length > 0 && (
          <div className="bg-zinc-100 rounded-md px-3 py-2 my-5">
            {searchedUsers.map((u) => (
              <UserInfo key={u.id} user={u} />
            ))}
          </div>
        )}
        <div
          className={clsx(
            "bg-zinc-100 dark:bg-sage-400 rounded-md px-3 py-2 my-5",
            showSuggestions ? "block" : "hidden xl:block"
          )}
        >
          <h3 className="border-b border-b-zinc-400 dark:border-b-sage-700">Suggestions</h3>
          <div className="flex flex-col">
            {suggestions &&
              suggestions.length > 0 &&
              suggestions.map((u) => <UserInfo key={u.id} user={u} />)}
            {isLoading && <ActivitySkeleton />}
          </div>
        </div>
      </div>
      {user && <Feed userId={user.id} type="general" />}
      <div className="hidden xl:block">
        <div className="bg-zinc-100 dark:bg-sage-400 p-5 rounded-md">
          <h3>Share Your Progress</h3>
          <Link href="/community/create-post">
            <Button
              variant="secondary"
              className="bg-zinc-200 dark:bg-sage-500 w-full text-md rounded-l-full rounded-r-full mt-2 hover:bg-zinc-300 hover:dark:bg-sage-700"
            >
              <Icons.share /> Share
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
