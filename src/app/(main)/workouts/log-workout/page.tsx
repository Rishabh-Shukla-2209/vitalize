"use client";

import Icons from "@/components/icons/appIcons";
import WorkoutHistoryCard from "@/components/workouts/WorkoutHistoryCard";
import WorkoutPlanCard from "@/components/workouts/WorkoutPlanCard";
import { getPastWorkouts, getWorkoutPlans } from "@/lib/actions/workout";
import { WorkoutPlanType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import WorkoutSkeleton from "@/components/profile/skeletons/WorkoutSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { handleAppError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const LogWorkoutPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedWorkouts, setSearchedWorkouts] = useState<
    Array<WorkoutPlanType>
  >([]);

  const { user } = useUser();

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await getWorkoutPlans(debouncedSearch, "", "", "", "");
        setSearchedWorkouts(res!.data);
      } catch (err) {
        handleAppError(err);
      }
    }

    if (debouncedSearch) getData();
  }, [debouncedSearch, user]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["past-workouts", user?.id],
      queryFn: ({ pageParam }) => getPastWorkouts("", "", pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
      staleTime: Infinity,
    });

  const recentWorkouts = data?.pages.flatMap((p) => p?.data) ?? [];

  return (
    <div className="p-5 md:px-15 lg:py-8 xl:px-60">
      <h1 className="mb-1">Log Workout</h1>
      <p>Select from your recent workouts or search for one.</p>
      <p className="flex items-center text-zinc-400 bg-zinc-100 dark:bg-sage-400 px-2.5 mt-3 rounded-lg w-85 md:w-100">
        <Icons.search />
        <input
          type="text"
          className="border-0 bg-zinc-100 dark:bg-sage-400 text-zinc-600 dark:text-zinc-100 flex-1"
          placeholder="Search all workouts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </p>
      <AnimatePresence>
        {debouncedSearch && (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows gap-5 mt-5"
          >
            {searchedWorkouts.length > 0 &&
              searchedWorkouts.map((workout) => (
                <Link
                  href={`/workouts/log-workout/${workout.id}`}
                  key={workout.id}
                >
                  <WorkoutPlanCard workout={workout} />
                </Link>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5 mt-5">
        {recentWorkouts && recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout) => (
            <WorkoutHistoryCard
              key={workout!.id}
              workout={workout!}
              action="log"
            />
          ))
        ) : isLoading ? (
          <WorkoutSkeleton />
        ) : (
          <p>No workouts to show right now.</p>
        )}
        {hasNextPage && (
          <div className="flex-center">
            <Button
              variant="ghost"
              className="text-primary"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? <Spinner /> : "See More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogWorkoutPage;
