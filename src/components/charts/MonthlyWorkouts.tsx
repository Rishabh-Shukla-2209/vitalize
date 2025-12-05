import { getStreaks } from "@/lib/actions/user";
import { getCurrMonthsWorkoutDates } from "@/lib/actions/charts";
import { handleAppError, monthDays } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getMonth } from "date-fns";
import ChartSkeleton from "./ChartSkeleton";

const MonthlyWorkouts = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workoutDays", userId],
    queryFn: async () => {
      const [dates, streaks] = await Promise.all([
        getCurrMonthsWorkoutDates(),
        getStreaks(),
      ]);
      return { dates, streaks };
    },
    staleTime: 12 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if(isError) handleAppError(error);
  if(!data) return <p>Unknown Error has occured while displaying this chart.</p>;

  const workedOutOnDays: boolean[] = [];
  const month = getMonth(new Date());
  const daysInCurrMonth = monthDays[month];

  for (let i = 1; i <= daysInCurrMonth; i++) {
    if (data?.dates!.includes(i)) {
      workedOutOnDays.push(true);
    } else {
      workedOutOnDays.push(false);
    }
  }
  const currStreak = data?.streaks?.currentStreakDays;
  const longestStreak = data?.streaks?.longestStreakDays;

  return (
    <div className="boundary w-full flex flex-col p-5 dark:bg-sage-400">
      <h3 className="text-center">Workouts This Month</h3>
      <div className="flex-center my-6">
        <div className="h-45 w-60 md:h-60 md:w-80 grid grid-rows-5 grid-cols-7 bg-zinc-100 dark:bg-sage-700 rounded-md">
          {workedOutOnDays.map((day, index) => (
            <div
              key={index}
              className={clsx(
                { "bg-primary dark:text-black": day },
                { "bg-zinc-100 dark:bg-sage-700": !day },
                "rounded flex-center"
              )}
            >
              <p>{index + 1}</p>
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
