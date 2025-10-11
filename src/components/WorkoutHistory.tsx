import { DatePicker } from "@/components/DatePicker";
import Selector from "@/components/Selector";
import { getPastWorkouts } from "@/lib/db";
import { MuscleGroups } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import WorkoutHistoryCard from "./WorkoutHistoryCard";
import { MuscleGroupType } from "@/lib/types";
import { Button } from "./ui/button";

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
    <div className="py-8 px-60">
      <h1 className="text-3xl font-semibold text-zinc-600 mb-1">
        Workout History
      </h1>
      <p className="text-zinc-600">
        View your past workouts and track your progress.
      </p>

      <div className="flex items-center my-5 gap-3">
        <p className="text-zinc-700">Filter by: </p>
        <DatePicker label="" date={date} setDate={setDate} />
        <Selector
          placeholder="Muscle Group"
          choices={MuscleGroups}
          setChoice={setMuscleGroup}
          selectedValue={muscleGroup}
        />
        <Button
          variant="default"
          disabled={!filtersApplied}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      <div>
        {isLoading || !data ? (
          <p>Loading...</p>
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