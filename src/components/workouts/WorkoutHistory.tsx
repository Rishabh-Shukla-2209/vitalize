import { DatePicker } from "@/components/DatePicker";
import Selector from "@/components/Selector";
import { getPastWorkouts } from "@/lib/actions/workout";
import { MuscleGroups } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import WorkoutHistoryCard from "./WorkoutHistoryCard";
import Icons from "../icons/appIcons";
import WorkoutHistoryCardSkeleton from "./WorkoutHistoryCardSkeleton";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { MuscleGroupType } from "@/lib/types";

const WorkoutHistory = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [muscleGroup, setMuscleGroup] = useState("");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["past-workouts", date, muscleGroup],
    queryFn: ({ pageParam }) =>
      getPastWorkouts(date, muscleGroup as MuscleGroupType, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    staleTime: Infinity,
  });

  const clearFilters = () => {
    setDate(undefined);
    setMuscleGroup("");
  };

  const workouts = data?.pages.flatMap((p) => p?.data) ?? [];

  return (
    <div className="p-5 md:px-15 lg:py-8 xl:px-60">
      <h1 className="mb-1">Workout History</h1>
      <p>View your past workouts and track your progress.</p>

      <div className="flex items-center my-5 gap-3">
        {date || muscleGroup ? (
          <Icons.removeFilter
            color="#38e07b"
            onClick={clearFilters}
            className="cursor-pointer"
          />
        ) : (
          <Icons.filter className="text-zinc-500" />
        )}
        <DatePicker label="" date={date} setDate={setDate} />
        <Selector
          placeholder="Muscle Group"
          choices={MuscleGroups}
          setChoice={setMuscleGroup}
          selectedValue={muscleGroup}
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col gap-5">
          <WorkoutHistoryCardSkeleton />
          <WorkoutHistoryCardSkeleton />
          <WorkoutHistoryCardSkeleton />
        </div>
      ) : isError ? (
        <p>Error loading workouts.</p>
      ) : workouts.length === 0 ? (
        <p>No workouts to show right now.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {workouts.map((workout) => (
            <WorkoutHistoryCard
              key={workout!.id}
              workout={workout!}
              action="repeat"
            />
          ))}

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
      )}
    </div>
  );
};

export default WorkoutHistory;
