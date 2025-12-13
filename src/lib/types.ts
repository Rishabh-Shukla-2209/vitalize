import { User } from "@/generated/prisma/client";
import { NotificationType } from "@/generated/prisma/enums";

export type DifficultyType = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type PrivacyType = "PUBLIC" | "PRIVATE";

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
      category: ExerciseCategoryType;
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
};

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
  workToRestRatio: number;
  plankHoldTime: number;
  tug: number;
  timeToExhaustion: number;
  heartRateVariability: number;
  WorkoutLogid: string;
};

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
  currValues: {
    set: number;
    reps: number;
    distance: number | null;
    time: number | null;
  };
} | null;

export type StackAction =
  | { type: "PUSH"; payload: WorkoutItem }
  | { type: "POP" }
  | { type: "CLEAR" };

export type WorkoutLogDataType = {
  notes: string;
  duration: number;
  balance?: {
    exerciseId: string;
    tug: number;
    sets: number;
    reps: number;
    rest: number;
  }[];

  cardio?: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    caloriesBurned: number;
    distance: number;
    duration: number;
    heartRate: number;
    vo2Max: number;
    speed: number;
  }[];

  core?: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    plankHoldTime: number;
  }[];

  endurance: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    timeToExhaustion: number;
  }[];

  flexibility?: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    rangeOfMotion: number;
    staticFlexibility: number;
    dynamicFlexibility: number;
  }[];

  hiit?: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    workIntervalDuration: number;
    workToRestRatio: number;
  }[];

  mindbody: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    duration: number;
  }[];

  recovery: {
    exerciseId: string;
    sets: number;
    reps: number;
    rest: number;
    heartRateVariability: number;
  }[];

  strength?: {
    exerciseId: string;
    sets: number;
    reps: number;
    weightUsed: number;
    rest: number;
    vol: number;
  }[];
};

export type OnboaringDataType = {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: Date;
  weight: number;
  height: number;
};

export type GoalType = {
  id: string;
  title: string;
  targetExercise: {
    name: string;
    id: string;
    category: string;
  };
  status: string;
  targetField: string;
  initialValue: number;
  currentValue: number;
  targetValue: number;
  targetDate: Date;
  createdAt: Date;
};

export type PRType = {
  id: string;
  prField: string;
  prValue: number;
  createdAt: Date;
  exercise: {
    name: string;
    category: string;
    id: string;
  };
};

export type UserDataType = {
  firstName: string | null;
  lastName: string | null;
  imgUrl: string | null;
  about: string | null;
  bio: string | null;
  privacy: PrivacyType;
  createdAt: Date;
} | null;

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FollowStatus = "Requested" | "Accepted" | "Not Following";

export type PostType = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imgUrl: string | null;
    privacy: PrivacyType;
  };
  workoutLog?: Omit<WorkoutLogType, "plan"> | null;
  _count: {
    Comment: number;
    PostLike: number;
  };
} & {
  id: string;
  body: string | null;
  title: string;
  createdAt: Date;
  imgUrl: string | null;
  privacy: "PUBLIC" | "PRIVATE";
  userid: string;
  workoutLogid: string | null;
  liked: boolean;
};

export type Cursor = { createdAt: Date; id: string } | null;
export type Source = "friends" | "public" | null;

export type PageParam = {
  cursor: Cursor;
  source: Source;
};

export type GetPostsResponse = {
  posts: PostType[];
  cursor: Cursor;
  nextSource: Source;
};

export type LikeType = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imgUrl: string | null;
  };
} & {
  id: string;
  postid?: string;
  commentid?: string;
  userid: string;
  createdAt: Date;
};

export type CommentType = {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imgUrl: string | null;
  };
  _count: {
    CommentLike: number;
  };
} & {
  id: string;
  createdAt: Date;
  userid: string;
  text: string;
  postid: string;
  parentid: string | null;
  updatedAt: Date;
  updated: boolean;
  liked: boolean;
  replies?: CommentType[];
};

export type FeedFetcher = (params: {
  userId: string;
  cursor: Cursor;
  source: Source;
}) => Promise<GetPostsResponse>;

export type ProfileDataType =
  | {
      prCount: number;
      workoutCount: number;
      profileUser: User;
      followStatus: FollowStatus;
    }
  | undefined;

export type NotificationPayload = {
  actor: {
    firstName: string | null;
    id: string;
  };
} & {
  id: string;
  recipientid: string;
  type: NotificationType;
  actorId: string;
  postid: string | null;
  commentid: string | null;
  isRead: boolean;
  readAt: Date | null;
  createdAt: Date;
};

export type FollowerFollowingType = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imgUrl: string | null;
};
