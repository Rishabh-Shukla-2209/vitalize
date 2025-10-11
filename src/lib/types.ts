export type DifficultyType = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
  | "NONE"
  | "DUMBBELL"
  | "BARBELL"
  | "KETTLEBELL"
  | "RESISTANCE_BAND"
  | "MACHINE"
  | "CABLE"
  | "SMITH_MACHINE"
  | "EZ_BAR"
  | "MEDICINE_BALL"
  | "STABILITY_BALL"
  | "BENCH"
  | "BOX"
  | "JUMP_ROPE"
  | "PULL_UP_BAR"
  | "TRX"
  | "TREADMILL"
  | "BIKE"
  | "ROWING_MACHINE"
  | "ELLIPTICAL";

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
};

export type WorkoutPlanDetailsType = {
  exercises: ({
        exercise: {
            name: string;
            imgUrl: string | null;
            category: ExerciseCategoryType | null;
            instructions: string;
            muscleGroup: MuscleGroupType;
            equipment: EquipmentType | null;
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
    })[];
} & {
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



export type ExerciseDetailsType = {
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

export type ExerciseLogType = {
    id: string;
    createdAt: Date;
    duration: number;
    exerciseid: string;
    sets: number;
    reps: number;
    vol: number;
    weightUsed: number;
    rest: number;
    distance: number;
    heartRate: number;
    speed: number;
    caloriesBurned: number;
    vo2Max: number;
    rpe: number;
    rangeOfMotion: number;
    staticFlexibility: number;
    dynamicFlexibility: number;
    workIntervalDuration: number;
    restIntervalDuration: number;
    workToRestRatio: string;
    numberOfRounds: number;
    plankHoldTime: number;
    tug: number;
    timeToExhaustion: number;
    heartRateVariability: number;
    WorkoutLogid: string;
}

export type WorkoutLogType = {
  plan: {
    name: string;
  };
  exercises: ({
    exercise: {
      name: string;
    };
  } & ExerciseLogType)[];
} & {
  id: string;
  createdAt: Date;
  userId: string;
  duration: number | null;
  planid: string | null;
  notes: string | null;
};


export type WorkoutItem = {
  exercise: ExerciseDetailsType | undefined;
  type: "work" | "rest";
  currValues: {set: number;
    reps: number;
    distance: number | null;
    time: number | null;
  };
} | null;

export type StackAction =
  | { type: "PUSH"; payload: WorkoutItem }
  | { type: "POP" }
  | { type: "CLEAR" };
