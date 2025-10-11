"use client";

import Icons from "@/components/icons/appIcons";
import WorkoutHistoryCard from "@/components/WorkoutHistoryCard";
import WorkoutPlanCard from "@/components/WorkoutPlanCard";
import { getPastWorkouts, getWorkoutPlans } from "@/lib/db";
import { WorkoutLogType, WorkoutPlanType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { motion, AnimatePresence } from "framer-motion";

const LogWorkoutPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedWorkouts, setSearchedWorkouts] = useState<
    Array<WorkoutPlanType>
  >([]);
  const [recentWorkouts, setRecentWorkouts] = useState<Array<WorkoutLogType>>(
    []
  );

  const { user, isLoaded, isSignedIn } = useUser();

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  useEffect(() => {
    async function getData() {
      const res = await getWorkoutPlans(debouncedSearch);
      setSearchedWorkouts(res);
    }

    if (debouncedSearch) getData();
  }, [debouncedSearch]);

  useEffect(() => {
    async function getData(userId: string) {
      const res = await getPastWorkouts(userId);
      setRecentWorkouts(res);
    }

    if (isLoaded && isSignedIn) getData(user.id);
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="py-8 px-60">
      <h1 className="text-3xl font-semibold text-zinc-600 mb-1">Log Workout</h1>
      <p className="text-zinc-600">
        Select from your recent workouts or search for one.
      </p>
      <p className="flex items-center text-zinc-400 bg-zinc-100 px-2.5 mt-3 rounded-lg w-100">
        <Icons.search />
        <input
          type="text"
          className="border-0 bg-zinc-100 text-zinc-600 flex-1"
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
            className="grid grid-cols-3 auto-rows gap-5 mt-5"
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
        {recentWorkouts.length > 0 ?
          recentWorkouts.map((workout) => (
            <WorkoutHistoryCard
              key={workout.id}
              workout={workout}
              action="log"
            />
          )) : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default LogWorkoutPage;
