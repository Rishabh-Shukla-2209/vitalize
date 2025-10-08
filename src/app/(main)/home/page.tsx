"use client";
import { hasWorkedOutToday } from "@/lib/db";
import ExerciseCategoryChart from "@/components/charts/ExerciseCategoryChart";
import MonthlyWorkouts from "@/components/charts/MonthlyWorkouts";
import MonthlyWorkoutsSkeleton from "@/components/charts/MonthlyWorkoutsSkeleton";
import ProgressCompChart from "@/components/charts/ProgressCompChart";
import WorkoutVolumeChart from "@/components/charts/WorkoutVolumeChart";
import WorkoutVolumeChartSkeleton from "@/components/charts/WorkoutVolumeChartSkeleton";
import Icons from "@/components/icons/appIcons";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import ExerciseCategoryChartSkeleton from "@/components/charts/ExerciseCategoryChartSkeleton";
import ProgressCompChartSkeleton from "@/components/charts/ProgressCompChartSkeleton";
import Link from "next/link";

const Homepage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [todaysWorkoutComplete, setTodaysWorkoutComplete] = useState(false);

  useEffect(() => {
    async function didWorkoutToday(userId: string) {
      const result = await hasWorkedOutToday(userId);
      setTodaysWorkoutComplete(result);
    }
    if (isLoaded && isSignedIn) {
      didWorkoutToday(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <div className="p-8 scroll-smooth">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-2 text-3xl font-semibold">
            <Icons.home height={30} width={30} /> <p className="">Home</p>
          </div>
        </div>
        <div className="mr-5">
          <Link href={'/workouts/log-workout'}>
            <button className="bg-primary-dark text-gray-900 px-2.5 py-2 rounded-lg mr-5">
              <span className="flex-center gap-1">
                <Icons.add /> <p>Log Workout</p>
              </span>
            </button>
          </Link>
          <Link href={'/programs/ai-coach'}>
            <button className="bg-zinc-200 text-gray-900 px-3.5 py-2.25 rounded-lg mr-5">
              <span className="flex-center gap-1">
                <Icons.ai /> <p>AI Coach</p>
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className="flex gap-10 mt-8">
        <div className="flex-4 flex flex-col gap-10">
          <div className="relative boundary p-5 overflow-hidden">
            <h3 className="text-lg text-gray-600">Today</h3>
            <p className="text-2xl font-bold text-gray-600 my-1">
              {todaysWorkoutComplete
                ? "Workout Complete"
                : "Ready to do today's wokout?"}
            </p>
            <p className="text-gray-600">
              {todaysWorkoutComplete
                ? "You crushed your workout today. Keep up the good work."
                : "Do something today that your future self will thank you for."}
            </p>
            {todaysWorkoutComplete && (
              <Icons.check className="absolute -right-12 -bottom-12 h-40 w-40 opacity-20 text-zinc-400" />
            )}
            {!todaysWorkoutComplete && (
              <Icons.uncheck className="absolute -right-12 -bottom-12 h-40 w-40 opacity-20 text-zinc-400" />
            )}
          </div>

          {isLoaded && isSignedIn ? (
            <>
              <WorkoutVolumeChart userId={user.id} />
              <ExerciseCategoryChart userId={user.id} />
              <ProgressCompChart userId={user.id} />
            </>
          ) : (
            <>
              <WorkoutVolumeChartSkeleton />
              <ExerciseCategoryChartSkeleton />
              <ProgressCompChartSkeleton />
            </>
          )}
        </div>

        <div className="flex flex-col flex-2 gap-10">
          {isLoaded && isSignedIn ? (
            <MonthlyWorkouts userId={user.id} />
          ) : (
            <MonthlyWorkoutsSkeleton />
          )}
          <div className="boundary w-full h-60"></div>
          <div className="boundary w-full h-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
