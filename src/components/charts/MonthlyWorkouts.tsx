import { getCurrMonthsWorkoutDates, getStreaks } from "@/lib/db";
import { monthDays } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getMonth } from "date-fns";
import MonthlyWorkoutsSkeleton from "./MonthlyWorkoutsSkeleton";

const MonthlyWorkouts = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workoutDays", userId],
    queryFn: async () => {
      const [dates, streaks] = await Promise.all([
        getCurrMonthsWorkoutDates(userId),
        getStreaks(userId),
      ]);
      return { dates, streaks };
    },
    staleTime: 12 * 60 * 60 * 1000,
  });

  if (isLoading || isError || !data) {
    return <MonthlyWorkoutsSkeleton />;
  }

  const workedOutOnDays: boolean[] = [];
  const month = getMonth(new Date());
  const daysInCurrMonth = monthDays[month];

  for (let i = 1; i <= daysInCurrMonth; i++) {
    if (data.dates.includes(i)) {
      workedOutOnDays.push(true);
    } else {
      workedOutOnDays.push(false);
    }
  }
  const currStreak = data.streaks?.currentStreakDays;
  const longestStreak = data.streaks?.longestStreakDays;

  return (
    <div className="boundary w-full h-100 flex flex-col p-5">
      <h3 className="text-center">Workouts This Month</h3>
      <div className="flex-center my-6">
        <div className="h-60 w-80 grid grid-rows-5 grid-cols-7">
          {workedOutOnDays.map((day, index) => (
            <div
              key={index}
              className={clsx(
                { "bg-primary-light": day },
                { "bg-zinc-100": !day },
                "rounded flex-center"
              )}
            >
              <p className="text-zinc-700">{index + 1}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-gray-600 px-2">
        <p>Longest Streak: {longestStreak} days</p>
        <p>Current Streak: {currStreak} days</p>
      </div>
    </div>
  );
};

export default MonthlyWorkouts;
