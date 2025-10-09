import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EquipmentType, ExerciseCategoryType, MuscleGroupType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ExerciseCategories: { label: string; val: ExerciseCategoryType }[] = [
  { label: "Cardio", val: "CARDIO" },
  { label: "Strength", val: "STRENGTH" },
  { label: "Flexibility", val: "FLEXIBILITY" },
  { label: "Hiit", val: "HIIT" },
  { label: "Core", val: "CORE" },
  { label: "Balance", val: "BALANCE" },
  { label: "Endurance", val: "ENDURANCE" },
  { label: "Recovery", val: "RECOVERY" },
  { label: "Mindbody", val: "MINDBODY" }
];

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

export const Difficulty: { label: string; val: string }[] = [
  { label: "Beginner", val: "BEGINNER" },
  { label: "Intermediate", val: "INTERMEDIATE" },
  { label: "Advanced", val: "ADVANCED" },
];

export const Equipment: { label: string; val: EquipmentType }[] = [
  { label: "None", val: "NONE" },
  { label: "Dumbbell", val: "DUMBBELL" },
  { label: "Barbell", val: "BARBELL" },
  { label: "Kettlebell", val: "KETTLEBELL" },
  { label: "Resistance Band", val: "RESISTANCE_BAND" },
  { label: "Machine", val: "MACHINE" },
  { label: "Cable", val: "CABLE" },
  { label: "Smith Machine", val: "SMITH_MACHINE" },
  { label: "Ez Bar", val: "EZ_BAR" },
  { label: "Medicine Ball", val: "MEDICINE_BALL" },
  { label: "Stability Ball", val: "STABILITY_BALL" },
  { label: "Bench", val: "BENCH" },
  { label: "Box", val: "BOX" },
  { label: "Jump Rope", val: "JUMP_ROPE" },
  { label: "Pull Up Bar", val: "PULL_UP_BAR" },
  { label: "Trx", val: "TRX" },
  { label: "Treadmill", val: "TREADMILL" },
  { label: "Bike", val: "BIKE" },
  { label: "Rowing Machine", val: "ROWING_MACHINE" },
  { label: "Elliptical", val: "ELLIPTICAL" }
];

export const MuscleGroups: { label: string; val: MuscleGroupType }[] = [
  { label: "Chest", val: "CHEST" },
  { label: "Back", val: "BACK" },
  { label: "Shoulders", val: "SHOULDERS" },
  { label: "Biceps", val: "BICEPS" },
  { label: "Triceps", val: "TRICEPS" },
  { label: "Forearms", val: "FOREARMS" },
  { label: "Traps", val: "TRAPS" },
  { label: "Rotator Cuff", val: "ROTATOR_CUFF" },
  { label: "Abs", val: "ABS" },
  { label: "Obliques", val: "OBLIQUES" },
  { label: "Lower Back", val: "LOWER_BACK" },
  { label: "Lats", val: "LATS" },
  { label: "Quads", val: "QUADS" },
  { label: "Hamstrings", val: "HAMSTRINGS" },
  { label: "Glutes", val: "GLUTES" },
  { label: "Calves", val: "CALVES" },
  { label: "Hip Flexors", val: "HIP_FLEXORS" },
  { label: "Adductors", val: "ADDUCTORS" },
  { label: "Abductors", val: "ABDUCTORS" },
  { label: "Full Body", val: "FULL_BODY" }
];



export const MuscleGroupToCategories: Record<MuscleGroupType, ExerciseCategoryType[]> =
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

export const Duration: {label: string, val: string}[] = [
  {label: "Under 30 mins", val: "30,31"},
  {label: "30 - 45 mins", val: "30,45"},
  {label: "45 - 60 mins", val: "45,60"},
  {label: "Over 60 mins", val: "60,500"},
]

export const fitnessMetricUnits = {
  sets: "",
  reps: "",
  weightUsed: "kg",
  distance: "km",
  rest: "s",
  duration: "s",
  heartRate: "bpm",
  speed: "m/s",
  caloriesBurned: "kcal",
  vo2Max: "ml/kg/min",
  rpe: "scale",
  rangeOfMotion: "degrees",
  staticFlexibility: "cm",
  dynamicFlexibility: "cm",
  workIntervalDuration: "s",
  restIntervalDuration: "s",
  workToRestRatio: "ratio",
  numberOfRounds: "count",
  plankHoldTime: "s",
  tug: "s",
  timeToExhaustion: "s",
  heartRateVariability: "ms",
};

export const fitnessMetricLabels = {
  sets: "Sets",
  reps: "Reps",
  weightUsed: "Weight Used",
  distance: "Distance",
  rest: "Rest",
  duration: "Duration",
  heartRate: "Heart Rate",
  speed: "Speed",
  caloriesBurned: "Calories Burned",
  vo2Max: "VO₂ Max",
  rpe: "RPE",
  rangeOfMotion: "Range of Motion",
  staticFlexibility: "Static Flexibility",
  dynamicFlexibility: "Dynamic Flexibility",
  workIntervalDuration: "Work Interval",
  restIntervalDuration: "Rest Interval",
  workToRestRatio: "Work:Rest Ratio",
  numberOfRounds: "Rounds",
  plankHoldTime: "Plank Hold",
  tug: "TUG",
  timeToExhaustion: "Time to Exhaustion",
  heartRateVariability: "HRV",
};



export const getAvailableCategoriesForMuscleGroup = (
  group: MuscleGroupType | ''
): {label: string, val: ExerciseCategoryType}[] => {
  if(group === '') return [];
  return MuscleGroupToCategories[group].map(el => ({label: toProperCase(el), val: el})) || [];
};

export const toProperCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
    .replace(/_/g, " ");
}

