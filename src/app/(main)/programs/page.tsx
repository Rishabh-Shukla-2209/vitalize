"use client";

import Icons from "@/components/icons/appIcons";
import Selector from "@/components/Selector";
import WorkoutPlanSkeleton from "@/components/workouts/WorkoutPlanSkeleton";
import WorkoutPlanCard from "@/components/workouts/WorkoutPlanCard";
import { getWorkoutPlans } from "@/lib/actions/workout";
import { DifficultyType, EquipmentType, MuscleGroupType } from "@/lib/types";
import { Difficulty, Duration, Equipment, MuscleGroups } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const ProgramsPage = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { user } = useUser();

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "workouts",
      { selectedMuscleGroup },
      { selectedDifficulty },
      { selectedEquipment },
      { selectedDuration },
      { debouncedSearch },
      { userId: user ? user.id : null },
    ],
    queryFn: ({ pageParam }) =>
      getWorkoutPlans(
        debouncedSearch,
        selectedMuscleGroup as MuscleGroupType | "",
        selectedEquipment as EquipmentType | "",
        selectedDifficulty as DifficultyType | "",
        selectedDuration,
        pageParam,
      ),
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    initialPageParam: 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (
      selectedMuscleGroup ||
      selectedEquipment ||
      selectedDifficulty ||
      selectedDuration
    ) {
      setFiltersApplied(true);
    } else {
      setFiltersApplied(false);
    }
  }, [
    selectedMuscleGroup,
    selectedEquipment,
    selectedDifficulty,
    selectedDuration,
  ]);

  const clearFilters = () => {
    setSelectedDifficulty("");
    setSelectedEquipment("");
    setSelectedMuscleGroup("");
    setSelectedDuration("");
  };

  const plans = data?.pages.flatMap((p) => p?.data) ?? [];

  return (
    <div className="px-5 py-7">
      <div className="flex flex-wrap gap-5 justify-between items-center mb-2">
        <h1>Workout Library</h1>
        <p className="flex items-center text-zinc-400 bg-zinc-100 dark:bg-sage-400 px-2.5 rounded-lg w-75 lg:w-85">
          <Icons.search />
          <input
            type="text"
            className="border-0 bg-zinc-100 dark:bg-sage-400 text-zinc-600 dark:text-zinc-100 flex-1"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </p>
      </div>
      <div className="flex gap-3 my-5">
        <div className="pt-1">
          {filtersApplied ? (
            <Icons.removeFilter
              color="#38e07b"
              onClick={clearFilters}
              className="cursor-pointer"
            />
          ) : (
            <Icons.filter className="text-zinc-500" />
          )}
        </div>
        <div className="flex flex-wrap gap-3 ">
          <Selector
            placeholder="Muscle Group"
            choices={MuscleGroups}
            setChoice={setSelectedMuscleGroup}
            selectedValue={selectedMuscleGroup}
          />
          <Selector
            placeholder="Equipment"
            choices={Equipment}
            setChoice={setSelectedEquipment}
            selectedValue={selectedEquipment}
          />
          <Selector
            placeholder="Difficulty"
            choices={Difficulty}
            setChoice={setSelectedDifficulty}
            selectedValue={selectedDifficulty}
          />
          <Selector
            placeholder="Duration"
            choices={Duration}
            setChoice={setSelectedDuration}
            selectedValue={selectedDuration}
          />
        </div>
      </div>
      {isLoading || !data ? (
        <WorkoutPlanSkeleton />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] auto-rows gap-5">
          {plans.length > 0 ? (
            plans.map((workout) => (
              <Link href={`/programs/${workout!.id}`} key={workout!.id}>
                <WorkoutPlanCard workout={workout!} />
              </Link>
            ))
          ) : (
            <p>No workouts are available for your selection.</p>
          )}
        </div>
      )}
      {hasNextPage && (
        <div className="flex-center mt-5">
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
      {isError && <p>Error fetching workouts!!</p>}
    </div>
  );
};

export default ProgramsPage;
