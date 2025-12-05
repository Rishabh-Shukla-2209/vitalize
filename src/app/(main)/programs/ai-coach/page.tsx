"use client";

import AIWorkout from "@/components/ai/AIWorkout";
import AIWorkoutSkeletom from "@/components/ai/AIWorkoutSkeletom";
import Icons from "@/components/icons/appIcons";
import MultiSelector from "@/components/MultiSelector";
import Selector from "@/components/Selector";
import { Button } from "@/components/ui/button";
import { createAiWorkout } from "@/lib/actions/ai";
import {
  DifficultyType,
  ExerciseCategoryType,
  MuscleGroupType,
} from "@/lib/types";
import { Difficulty, ExerciseCategories, MuscleGroups } from "@/lib/utils";
import { AiWorkoutSchemaType } from "@/validations/ai";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const AICoachPage = () => {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    Array<string>
  >([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [muscleGroupError, setMuscleGroupError] = useState("");
  const [difficultyError, setDifficultyError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [aiWorkout, setAiWorkout] = useState<AiWorkoutSchemaType>();
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  const onSubmit = async () => {
    if (!user) return;

    if (!selectedCategory || selectedMuscleGroups.length === 0 || !selectedDifficulty) {
      if (!selectedCategory) setCategoryError("Required");
      if (selectedMuscleGroups.length === 0) setMuscleGroupError("Required");
      if (!selectedDifficulty) setDifficultyError("Required");
      return;
    }
    
    setButtonDisabled(true);
    setLoading(true);

    const aiResult = await createAiWorkout(
      selectedMuscleGroups as Array<MuscleGroupType>,
      selectedCategory as ExerciseCategoryType,
      selectedDifficulty as DifficultyType
    );    
    setLoading(false);
    setButtonDisabled(false);
    setAiWorkout(aiResult);
  };

  useEffect(() => {
    if (selectedCategory) setCategoryError("");
    if (selectedMuscleGroups.length > 0) setMuscleGroupError("");
    if (selectedDifficulty) setDifficultyError("");
  }, [selectedCategory, selectedDifficulty, selectedMuscleGroups]);

  return (
    <div className="px-5 py-7">
      <div className="mb-10">
        <h1 className="mb-1.5">
          AI Workout Coach
        </h1>
        <p>
          Get a personalised workout plan tailored to your goals.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex flex-col gap-5 flex-1">
          <h3>Select your requirements.</h3>
          <Selector
            placeholder="Difficulty"
            choices={Difficulty}
            setChoice={setSelectedDifficulty}
            selectedValue={selectedDifficulty}
            classes="w-full"
          />
          {difficultyError && <span className="error">{difficultyError}</span>}
          <MultiSelector
            choices={MuscleGroups}
            setChoices={setSelectedMuscleGroups}
            placeholder="Muscle groups"
            selectedValues={selectedMuscleGroups}
          />
          {muscleGroupError && (
            <span className="error">{muscleGroupError}</span>
          )}
          <Selector
            placeholder="Category"
            choices={ExerciseCategories}
            setChoice={setSelectedCategory}
            selectedValue={selectedCategory}
            classes="w-full"
          />
          {categoryError && <span className="error">{categoryError}</span>}
          <Button
            variant="default"
            className="text-lg"
            onClick={onSubmit}
            disabled={buttonDisabled}
          >
            <Icons.sparkle />
            Generate Workout
          </Button>
        </div>
        <div className="flex-3">
          {loading && <AIWorkoutSkeletom />}
          {(aiWorkout && user) && <AIWorkout userId={user.id} workout={aiWorkout}/>}
        </div>
      </div>
    </div>
  );
};

export default AICoachPage;
