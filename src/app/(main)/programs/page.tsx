"use client";

import Icons from "@/components/icons/appIcons";
import Selector from "@/components/Selector";
import WorkoutPlanSkeleton from "@/components/WorkoutPlanSkeleton";
import WorkoutPlanCard from "@/components/WorkoutPlanCard";
import { getWorkoutPlans } from "@/lib/queries";
import { DifficultyType, EquipmentType, MuscleGroupType } from "@/lib/types";
import { Difficulty, Duration, Equipment, MuscleGroups } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from "react-use";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "workouts",
      { selectedMuscleGroup },
      { selectedDifficulty },
      { selectedEquipment },
      { selectedDuration },
      { debouncedSearch },
      { userId: user ? user.id : null },
    ],
    queryFn: async () => {
      const data = await getWorkoutPlans(
        debouncedSearch,
        selectedMuscleGroup as MuscleGroupType | "",
        selectedEquipment as EquipmentType | "",
        selectedDifficulty as DifficultyType | "",
        selectedDuration,
        user ? user.id : null
      );

      return data;
    },
    staleTime: 60 * 60 * 1000,
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
        <div className="pt-1">{filtersApplied ? <Icons.removeFilter color="#38e07b" onClick={clearFilters} className="cursor-pointer"/> : <Icons.filter className="text-zinc-500"/>}</div>
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
          {data.length > 0 ? (
            data.map((workout) => (
              <Link href={`/programs/${workout.id}`} key={workout.id}>
                <WorkoutPlanCard workout={workout} />
              </Link>
            ))
          ) : (
            <p>No workouts are available for your selection.</p>
          )}
        </div>
      )}
      {isError && <p>Error fetching workouts!!</p>}
    </div>
  );
};

export default ProgramsPage;
