import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ExerciseCategories = [
  "CARDIO",
  "STRENGTH",
  "FLEXIBILITY",
  "HIIT",
  "CORE",
  "BALANCE",
  "ENDURANCE",
  "RECOVERY",
  "MINDBODY",
];

export type ExerciseCategory =
  | "CARDIO"
  | "STRENGTH"
  | "FLEXIBILITY"
  | "HIIT"
  | "CORE"
  | "BALANCE"
  | "ENDURANCE"
  | "RECOVERY"
  | "MINDBODY";

export const ExerciseFilterOptions = {
  CARDIO: "caloriesBurned",
  STRENGTH: "vol",
  FLEXIBILITY: "rangeOfMotion",
  HIIT: "workToRestRatio",
  CORE: "plankHoldTime",
  BALANCE: "tug",
  ENDURANCE: "timeToExhaustion",
  RECOVERY: "heartRateVariability",
  MINDBODY: "duration",
} as const;

export type MuscleGroup =
  | "CHEST"
  | "BACK"
  | "SHOULDERS"
  | "BICEPS"
  | "TRICEPS"
  | "FOREARMS"
  | "TRAPS"
  | "ROTATOR_CUFF"
  | "ABS"
  | "OBLIQUES"
  | "LOWER_BACK"
  | "LATS"
  | "QUADS"
  | "HAMSTRINGS"
  | "GLUTES"
  | "CALVES"
  | "HIP_FLEXORS"
  | "ADDUCTORS"
  | "ABDUCTORS"
  | "FULL_BODY";

export const MuscleGroups = [
  "CHEST",
  "BACK",
  "SHOULDERS",
  "BICEPS",
  "TRICEPS",
  "FOREARMS",
  "TRAPS",
  "ROTATOR_CUFF",
  "ABS",
  "OBLIQUES",
  "LOWER_BACK",
  "LATS",
  "QUADS",
  "HAMSTRINGS",
  "GLUTES",
  "CALVES",
  "HIP_FLEXORS",
  "ADDUCTORS",
  "ABDUCTORS",
  "FULL_BODY"
]

export const MuscleGroupToCategories: Record<MuscleGroup, ExerciseCategory[]> =
  {
    CHEST: ["STRENGTH", "HIIT"],
    BACK: ["STRENGTH", "HIIT"],
    SHOULDERS: ["STRENGTH", "HIIT"],
    BICEPS: ["STRENGTH"],
    TRICEPS: ["STRENGTH"],
    FOREARMS: ["STRENGTH"],
    TRAPS: ["STRENGTH"],
    ROTATOR_CUFF: ["STRENGTH", "FLEXIBILITY", "RECOVERY"],
    ABS: ["CORE", "STRENGTH", "HIIT", "ENDURANCE"],
    OBLIQUES: ["CORE", "STRENGTH", "HIIT", "ENDURANCE"],
    LOWER_BACK: ["CORE", "STRENGTH", "FLEXIBILITY"],
    LATS: ["STRENGTH", "HIIT"],
    QUADS: ["STRENGTH", "HIIT", "CARDIO", "ENDURANCE"],
    HAMSTRINGS: ["STRENGTH", "HIIT", "CARDIO", "ENDURANCE"],
    GLUTES: ["STRENGTH", "HIIT", "CARDIO", "ENDURANCE"],
    CALVES: ["STRENGTH", "CARDIO", "ENDURANCE"],
    HIP_FLEXORS: ["STRENGTH", "FLEXIBILITY", "RECOVERY"],
    ADDUCTORS: ["STRENGTH", "FLEXIBILITY"],
    ABDUCTORS: ["STRENGTH", "FLEXIBILITY"],
    FULL_BODY: ["STRENGTH", "HIIT", "CORE", "ENDURANCE", "BALANCE", "FLEXIBILITY", "MINDBODY", "RECOVERY", "CARDIO"],
  };

export const getAvailableCategoriesForMuscleGroup = (
  group: MuscleGroup
): ExerciseCategory[] => {
  return MuscleGroupToCategories[group] || [];
};
