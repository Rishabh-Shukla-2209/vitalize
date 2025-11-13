"use client";

import Feed from "@/components/community/Feed";
import UserInfo from "@/components/community/UserInfo";
import Icons from "@/components/icons/appIcons";
import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma";
import { getSuggestions, searchUsers } from "@/lib/queries";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

const CommunityPage = () => {
  const { user } = useUser();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async (userId: string) => {
      const res = await searchUsers(userId, debouncedSearch);
      setSearchedUsers(res);
    };

    if (user && debouncedSearch) fetchUsers(user.id);
    if(!debouncedSearch) setSearchedUsers([]);
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
    <div className="flex justify-around mt-5 w-full">
      <div>
        <p className="flex items-center text-zinc-400 bg-zinc-100 px-2.5 rounded-lg w-85">
          <Icons.search />
          <input
            type="text"
            className="border-0 bg-zinc-100 text-zinc-600 flex-1"
            placeholder="Search for a friend..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </p>
        {searchedUsers.length > 0 && (
          <div className="bg-zinc-100 rounded-md px-3 py-2 mt-5">
            {searchedUsers.map((u) => (
              <UserInfo key={u.id} user={u} />
            ))}
          </div>
        )}
        <div className="bg-zinc-100 rounded-md px-3 py-2 mt-5">
          <h3 className="text-lg text-gray-600 font-semibold border-b border-b-zinc-400">
            Suggestions
          </h3>
          <div className="flex flex-col">
            {suggestions &&
              suggestions.length > 0 &&
              suggestions.map((u) => <UserInfo key={u.id} user={u} />)}
            {isLoading && <p>Loading...</p>}
          </div>
        </div>
      </div>
      {user && <Feed userId={user.id} type="general"/>}
      <div>
        <div className="bg-zinc-100 p-5 rounded-md">
          <h3 className="text-lg text-gray-600 font-semibold">
            Share Your Progress
          </h3>
          <Link href='/community/create-post'>
            <Button
              variant="secondary"
              className="bg-zinc-200 w-full text-md rounded-l-full rounded-r-full mt-2 hover:bg-zinc-300"
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
