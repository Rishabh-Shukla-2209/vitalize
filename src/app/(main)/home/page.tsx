"use client";
import { hasWorkedOutToday } from "@/lib/queries";
import ExerciseCategoryChart from "@/components/charts/ExerciseCategoryChart";
import MonthlyWorkouts from "@/components/charts/MonthlyWorkouts";
import ProgressCompChart from "@/components/charts/ProgressCompChart";
import WorkoutVolumeChart from "@/components/charts/WorkoutVolumeChart";
import Icons from "@/components/icons/appIcons";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Link from "next/link";
import Goals from "@/components/goal/ActiveGoals";
import PRs from "@/components/personalRecords/RecentPRs";
import GoalSkeleton from "@/components/goal/GoalSkeleton";
import PRSkeleton from "@/components/personalRecords/PRSkeleton";
import { Button } from "@/components/ui/button";
import ChartSkeleton from "@/components/charts/ChartSkeleton";

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
      <div className="flex flex-wrap gap-5 justify-between">
        <div>
          <div className="flex items-center gap-2 text-3xl font-semibold">
            <Icons.home height={30} width={30} /> <p>Home</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 mr-5">
          <Link href={"/workouts/log-workout"}>
            <Button>
              <span className="flex-center gap-1">
                <Icons.add /> <p className="text-white font-bold">Log Workout</p>
              </span>
            </Button>
          </Link>
          <Link href={"/programs/ai-coach"}>
            <Button variant="secondary" className="p-5">
              <span className="flex-center gap-1">
                <Icons.ai /> <p className="font-bold">AI Coach</p>
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-10 mt-8">
        <div className="flex-4 flex flex-col gap-10">
          <div className="relative boundary p-5 overflow-hidden">
            <h3>Today</h3>
            <p className="text-2xl font-bold text-gray-600 my-1">
              {todaysWorkoutComplete
                ? "Workout Complete"
                : "Ready to do today's wokout?"}
            </p>
            <p>
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
              <ChartSkeleton />
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          )}
        </div>

        <div className="flex flex-col flex-2 gap-10">
          {isLoaded && isSignedIn ? (
            <>
              <MonthlyWorkouts userId={user.id} />
              <Goals userId={user.id} />
              <PRs userId={user.id} />
            </>
          ) : (
            <>
              <ChartSkeleton />
              <GoalSkeleton />
              <PRSkeleton />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
