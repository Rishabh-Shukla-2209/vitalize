export type DifficultyType = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" ;

export type ExerciseCategoryType =
  | "CARDIO"
  | "STRENGTH"
  | "FLEXIBILITY"
  | "HIIT"
  | "CORE"
  | "BALANCE"
  | "ENDURANCE"
  | "RECOVERY"
  | "MINDBODY";


export type MuscleGroupType =
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

export type EquipmentType = 
  |"NONE"
  |"DUMBBELL"
  |"BARBELL"
  |"KETTLEBELL"
  |"RESISTANCE_BAND"
  |"MACHINE"
  |"CABLE"
  |"SMITH_MACHINE"
  |"EZ_BAR"
  |"MEDICINE_BALL"
  |"STABILITY_BALL"
  |"BENCH"
  |"BOX"
  |"JUMP_ROPE"
  |"PULL_UP_BAR"
  |"TRX"
  |"TREADMILL"
  |"BIKE"
  |"ROWING_MACHINE"
  |"ELLIPTICAL"


  
export type WorkoutPlanType = {
    id: string;
    name: string;
    userId: string | null;
    level: DifficultyType;
    imgUrl: string | null;
    description: string;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

export type ExercisePropType = {
  exercise: {
    name: string;
    category: ExerciseCategoryType | null;
    instructions: string | null;
    muscleGroup: MuscleGroupType;
    equipment: EquipmentType | null;
    imgUrl: string | null;
  };
} & {
  id: string;
  position: number;
  time: number | null;
  sets: number;
  reps: number;
  rest: number;
  distance: number | null;
  exerciseid: string;
  WorkoutPlanid: string;
};