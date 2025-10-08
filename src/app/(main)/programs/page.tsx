"use client";

import Icons from "@/components/icons/appIcons";
import Selector from "@/components/Selector";
import { Button } from "@/components/ui/button";
import WorkoutPlanCard from "@/components/WorkoutPlanCard";
import { getWorkoutPlans } from "@/lib/db";
import { DifficultyType, EquipmentType, MuscleGroupType } from "@/lib/types";
import { Difficulty, Duration, Equipment, MuscleGroups } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {useDebounce} from 'react-use'

const ProgramsPage = () => {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useDebounce(()=>setDebouncedSearch(search), 500, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "workouts",
      { selectedMuscleGroup },
      { selectedDifficulty },
      { selectedEquipment },
      { selectedDuration },
      { debouncedSearch },
    ],
    queryFn: async() => {
      const data = await getWorkoutPlans(
        selectedMuscleGroup as MuscleGroupType | '',
        selectedEquipment as EquipmentType | '',
        selectedDifficulty as DifficultyType | '',
        selectedDuration,
        debouncedSearch
      );

      return data;
    },
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (selectedMuscleGroup || selectedEquipment || selectedDifficulty || selectedDuration) {
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
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-semibold text-zinc-700">
          Workout Library
        </h1>
        <p className="flex items-center text-zinc-400 bg-zinc-100 px-2.5 rounded-lg w-85">
          <Icons.search />
          <input
            type="text"
            className="border-0 bg-zinc-100 text-zinc-600"
            placeholder="Search workouts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </p>
      </div>
      <div className="flex gap-3 my-5">
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
        <Button
          variant="default"
          disabled={!filtersApplied}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>
      {isLoading || !data ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-4 auto-rows gap-5">
          {data.length > 0 ? (
            data.map((workout) => (
              <WorkoutPlanCard key={workout.id} workout={workout} />
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
