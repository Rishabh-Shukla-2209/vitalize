import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CropArea,
  DifficultyType,
  EquipmentType,
  ExerciseCategoryType,
  ExerciseLogType,
  MuscleGroupType,
  NotificationPayload,
} from "./types";
import { differenceInCalendarDays, differenceInMinutes, isToday, isYesterday } from "date-fns";
import { GoalStatus as Status } from "@/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const links = [
  { name: "Home", href: "/home" },
  { name: "Workouts", href: "/workouts" },
  { name: "Programs", href: "/programs" },
  { name: "Community", href: "/community" },
];

export const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const GenderOptions = [
  { label: "Male", val: "MALE" },
  { label: "Female", val: "FEMALE" },
  { label: "Other", val: "OTHER" },
];

export const ExerciseCategories: {
  label: string;
  val: ExerciseCategoryType;
}[] = [
  { label: "Cardio", val: "CARDIO" },
  { label: "Strength", val: "STRENGTH" },
  { label: "Flexibility", val: "FLEXIBILITY" },
  { label: "Hiit", val: "HIIT" },
  { label: "Core", val: "CORE" },
  { label: "Balance", val: "BALANCE" },
  { label: "Endurance", val: "ENDURANCE" },
  { label: "Recovery", val: "RECOVERY" },
  { label: "Mindbody", val: "MINDBODY" },
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

export const Difficulty: { label: string; val: DifficultyType }[] = [
  { label: "Beginner", val: "BEGINNER" },
  { label: "Intermediate", val: "INTERMEDIATE" },
  { label: "Advanced", val: "ADVANCED" },
];

export const GoalStatus: { label: string; val: Status | "All" }[] = [
  { label: "All", val: "All" },
  { label: "Active", val: "IN_PROGRESS" },
  { label: "Achieved", val: "ACHIEVED" },
  { label: "Missed", val: "MISSED" },
  { label: "Abandoned", val: "ABANDONED" },
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
  { label: "Elliptical", val: "ELLIPTICAL" },
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
  { label: "Full Body", val: "FULL_BODY" },
];

export const MuscleGroupToCategories: Record<
  MuscleGroupType,
  ExerciseCategoryType[]
> = {
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
  FULL_BODY: [
    "STRENGTH",
    "HIIT",
    "CORE",
    "ENDURANCE",
    "BALANCE",
    "FLEXIBILITY",
    "MINDBODY",
    "RECOVERY",
    "CARDIO",
  ],
};

export const Duration: { label: string; val: string }[] = [
  { label: "Under 30 mins", val: "30,31" },
  { label: "30 - 45 mins", val: "30,45" },
  { label: "45 - 60 mins", val: "45,60" },
  { label: "Over 60 mins", val: "60,500" },
];

export const fitnessMetricUnits = {
  sets: "",
  reps: "",
  weightUsed: "kg",
  vol: "kg",
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
  plankHoldTime: "s",
  tug: "s",
  timeToExhaustion: "s",
  heartRateVariability: "ms",
};

export const fitnessMetricLabels = {
  sets: "Sets",
  reps: "Reps",
  vol: "Volume",
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
  plankHoldTime: "Plank Hold Time",
  tug: "TUG",
  timeToExhaustion: "Time to Exhaustion",
  heartRateVariability: "HRV",
};

export const validCategoryFields: {
  [k in ExerciseCategoryType]: Array<{label: string, val: keyof ExerciseLogType}>;
} = {
  CARDIO: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Calories Burned", val: "caloriesBurned" },
    { label: "Distance", val: "distance" },
    { label: "Duration", val: "duration" },
    { label: "Heart Rate", val: "heartRate" },
    { label: "VO2 Max", val: "vo2Max" },
    { label: "Speed", val: "speed" },
  ],
  BALANCE: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "TUG", val: "tug" },
  ],
  STRENGTH: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Volume", val: "vol" },
    { label: "Weight Used", val: "weightUsed" },
  ],
  FLEXIBILITY: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Range of Motion", val: "rangeOfMotion" },
    { label: "Dynamic Flexibility", val: "dynamicFlexibility" },
    { label: "Static Flexibility", val: "staticFlexibility" },
  ],
  MINDBODY: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Duration", val: "duration" },
  ],
  ENDURANCE: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Time to Exhaustion", val: "timeToExhaustion" },
  ],
  HIIT: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Work to Rest Ratio", val: "workToRestRatio" },
    { label: "Work Interval Duration", val: "workIntervalDuration" },
  ],
  CORE: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Plank Hold Time", val: "plankHoldTime" },
  ],
  RECOVERY: [
    { label: "Sets", val: "sets" },
    { label: "Reps", val: "reps" },
    { label: "Heart Rate Variability", val: "heartRateVariability" },
  ],
};


export const getAvailableCategoriesForMuscleGroup = (
  group: MuscleGroupType | ""
): { label: string; val: ExerciseCategoryType }[] => {
  if (group === "") return [];
  return (
    MuscleGroupToCategories[group].map((el) => ({
      label: toProperCase(el),
      val: el,
    })) || []
  );
};

export const toProperCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/_/g, " ");
};

export const timeAgo = (date: Date) => {
  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return `${differenceInCalendarDays(new Date(), date)} days ago`;
};


export const minutesAgo = (time: Date) => {
  const diffInMin = differenceInMinutes(new Date(), time);
  
  if(diffInMin < 60){
    return `${diffInMin}m`;
  }

  const minInDay = 24 * 60;

  if(diffInMin < minInDay){
    const hours = Math.floor(diffInMin / 60);
    return `${hours}h`;
  }

  const days = Math.floor(diffInMin / minInDay);
  return `${days}d`;
};

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}


export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: CropArea,
  outputWidth: number,
  outputHeight: number
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Canvas is empty");
      resolve(blob);
    }, "image/jpeg");
  });
}

export const getNotificationDetails = (notification: NotificationPayload) => {
  const text = {
    "FOLLOW": `${notification.actor.firstName} started following you`,
    "FOLLOW_REQUESTED": `${notification.actor.firstName} sent you follow request`,
    "FOLLOW_ACCEPTED": `${notification.actor.firstName} accepted your follow request`,
    "LIKE_POST": `${notification.actor.firstName} liked your post`,
    "LIKE_COMMENT": `${notification.actor.firstName} liked your comment`,
    "COMMENT_POST": `${notification.actor.firstName} commented on your post`,
    "COMMENT_COMMENT": `${notification.actor.firstName} commented on your comment`,
  }

  const link = {
    "FOLLOW": `/community/user/${notification.actorId}`,
    "FOLLOW_REQUESTED": `/community/user/${notification.actorId}`,
    "FOLLOW_ACCEPTED": `/community/user/${notification.actorId}`,
    "LIKE_POST": `/community/post/${notification.postid}`,
    "LIKE_COMMENT": `/community/post/${notification.postid}?commentId=${notification.commentid}`,
    "COMMENT_POST": `/community/post/${notification.postid}?commentId=${notification.commentid}`,
    "COMMENT_COMMENT": `/community/post/${notification.postid}?commentId=${notification.commentid}`,
  }

  return {text: text[notification.type], link: link[notification.type]};
}