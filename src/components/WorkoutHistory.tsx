import { DatePicker } from "@/components/DatePicker";
import Selector from "@/components/Selector";
import { getPastWorkouts } from "@/lib/queries";
import { MuscleGroups } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { MuscleGroupType } from "@/lib/types";
import Icons from "./icons/appIcons";
import WorkoutHistoryCardSkeleton from "./WorkoutHistoryCardSkeleton";

const WorkoutHistory = ({ userId }: { userId: string }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [muscleGroup, setMuscleGroup] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [userId, { date }, { muscleGroup }],
    queryFn: () => getPastWorkouts(userId, date, muscleGroup as MuscleGroupType),
    staleTime: 5 * 60 * 1000,
  });

  const clearFilters = () => {
    setDate(undefined);
    setMuscleGroup("");
  };

  useEffect(() => {
    if(date || muscleGroup){
        setFiltersApplied(true);
    }else{
        setFiltersApplied(false);
    }
  }, [date, muscleGroup])

  return (
    <div className="p-5 md:px-15 lg:py-8 xl:px-60">
      <h1 className="mb-1">
        Workout History
      </h1>
      <p>
        View your past workouts and track your progress.
      </p>

      <div className="flex items-center my-5 gap-3">
        {filtersApplied ? <Icons.removeFilter color="#38e07b" onClick={clearFilters} className="cursor-pointer"/> : <Icons.filter className="text-zinc-500"/>}
        <DatePicker label="" date={date} setDate={setDate} />
        <Selector
          placeholder="Muscle Group"
          choices={MuscleGroups}
          setChoice={setMuscleGroup}
          selectedValue={muscleGroup}
        />
      </div>

      <div>
        {isLoading || !data ? (
          <div className="w-full flex flex-col gap-5">
            <WorkoutHistoryCardSkeleton />
            <WorkoutHistoryCardSkeleton />
            <WorkoutHistoryCardSkeleton />
          </div>
        ) : (
          <div className="flex flex-col gap-5 ">
            {data.length > 0 ? (
              data.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} action="repeat" />
              ))
            ) : (
              <p>No workouts to show right now.</p>
            )}{" "}
          </div>
        )}
        {isError && <p>Error Fetching workouts.</p>}
      </div>
    </div>
  );
};

export default WorkoutHistory;