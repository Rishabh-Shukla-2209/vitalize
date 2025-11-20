"use client";

import AIWorkout from "@/components/aiWorkout/AIWorkout";
import AIWorkoutSkeletom from "@/components/aiWorkout/AIWorkoutSkeletom";
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

// const mockWorkout: AiWorkoutSchemaType = {
//     description:
//       "A beginner-focused full-body strength session targeting chest, back, shoulders, biceps, triceps, forearms, abs, lower back, quads, lats, hamstrings, glutes and calves using foundational compound and accessory movements.",
//     duration: 60,
//     level: "BEGINNER",
//     name: "Beginner Full-Body Strength",
//     exercises: [
//       {
//         position: 1,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 8,
//         rest: 90,
//         exerciseId: "d6b13585-7f73-4550-8c81-d3288bc6d742",
//       },
//       {
//         position: 2,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 8,
//         rest: 90,
//         exerciseId: "69c96db9-c147-4756-8bc1-ab854971fc96",
//       },
//       {
//         position: 3,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 5,
//         rest: 120,
//         exerciseId: "0a058928-4da0-4c60-808b-cde543dee511",
//       },
//       {
//         position: 4,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 6,
//         rest: 90,
//         exerciseId: "78eddb71-fc5e-4e74-bee1-2a735802adc8",
//       },
//       {
//         position: 5,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 12,
//         rest: 60,
//         exerciseId: "da30947b-e933-40d7-9dca-cdf4effaf472",
//       },
//       {
//         position: 6,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 3,
//         reps: 12,
//         rest: 60,
//         exerciseId: "334dc35c-9ee8-408c-ab30-7f2b088482cc",
//       },
//       {
//         position: 7,
//         name: "Back Squats",
//         benefit: "Improves Squat stability and quad strength",
//         sets: 2,
//         reps: 15,
//         rest: 45,
//         exerciseId: "7ac1ad1c-a414-4cca-a0e9-01092aa1a34b",
//       },
//     ],
//   };

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
