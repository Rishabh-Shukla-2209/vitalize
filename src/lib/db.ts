"use server";

import prisma from "@/lib/prisma";
import {
  differenceInCalendarDays,
  format,
  getDate,
  getMonth,
  getYear,
  subDays,
} from "date-fns";
import { dayName, ExerciseCategory, ExerciseFilterOptions, MuscleGroup } from "./utils";

export const getLastWeekVol = async (userId: string) => {
  const earliestDate = subDays(new Date(), 7);

  //get last 7 days exercise data in the format {sets, reps, createdAt}[]

  const rawData = await prisma.exerciseLog.findMany({
    where: {
      WorkoutLog: {
        userId: userId,
      },
      createdAt: {
        gte: earliestDate,
      },
      vol: {
        gt: 0,
      },
    },
    select: {
      vol: true,
      createdAt: true,
    },
  });

  //convert the raw data into the format {day, vol}[]
  //it will be last 7 days and the corresponding volume (sets * reps * weightUsed)
  //but days will still be repeated so convert into one day one val in asc order

  const earliestDayName = format(earliestDate, "ccc");
  let dayIndex = dayName.indexOf(earliestDayName);

  const result = new Map<string, number>();

  for (let i = 0; i < 7; i++) {
    result.set(dayName[dayIndex % 7], 0);
    dayIndex++;
  }

  rawData.forEach((data) => {
    const day = format(data.createdAt, "ccc");
    result.set(day, result.get(day)! + data.vol);
  });

  const transformedData = Array.from(result, ([key, val]) => ({
    name: key,
    vol: val,
  }));

  const beforePrevWeekLogs = await prisma.exerciseLog.findMany({
    where: {
      WorkoutLog: {
        userId: userId,
      },
      createdAt: {
        gte: subDays(new Date(), 14),
        lt: earliestDate,
      },
      vol: {
        gt: 0,
      },
    },
    select: {
      vol: true,
    },
  });

  const totalVolCurrent = transformedData.reduce(
    (total, day) => total + day.vol,
    0
  );
  const totalVolPrev = beforePrevWeekLogs.reduce(
    (total, day) => total + day.vol,
    0
  );

  const returnResult = {
    lastWeekVolData: transformedData,
    totalVolCurrent,
    totalVolPrev,
  } as const;

  return returnResult;
};

export const getCurrMonthsWorkoutDates = async (userId: string) => {
  //shape of the data required: [daynumbersOnly] e.g. [1, 3, 5, 6, ...]

  const rawData = await prisma.workoutLog.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: new Date(getYear(new Date()), getMonth(new Date()), 1),
      },
    },
    select: {
      createdAt: true,
    },
  });

  const result = rawData.map((workoutLog) => getDate(workoutLog.createdAt));

  return result;
};

export const getStreaks = async (userId: string) => {
  const streaks = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      currentStreakDays: true,
      longestStreakDays: true,
    },
  });

  return streaks;
};

export const hasWorkedOutToday = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      lastActiveOn: true,
    },
  });
  if (!result?.lastActiveOn) {
    return false;
  }

  const now = new Date();
  const startOfToday = new Date(getYear(now), getMonth(now), getDate(now));

  if (result.lastActiveOn < startOfToday) {
    return false;
  }

  return true;
};

export const getExerciseCatData = async (
  userId: string,
  category: ExerciseCategory,
  startDate = new Date(),
  endDate = new Date(),
) => {
  
  const data = await prisma.exerciseLog.findMany({
    where: {
      WorkoutLog: {
        userId: userId,
      },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      exercise: {
        category
      },
    },

    select: {
      [ExerciseFilterOptions[category]]: true,
      createdAt: true,
    },
  });

  const diffInDates = differenceInCalendarDays(endDate, startDate);
  const dayVolArr: number[] = Array(diffInDates).fill(0);  

  data.forEach((record) => {
    // @ts-expect-error The data from Prisma is fine but due to 
    // [ExerciseFilterOptions[category]]: true, ts can't infer type properly.
    const index = differenceInCalendarDays(record.createdAt, startDate);
    // @ts-expect-error same as above
    dayVolArr[index] += record[ExerciseFilterOptions[category]]; 
  });

  const result = dayVolArr.map((val, index) => ({name: index.toString(), val}));
  
  return result;
};

export const getMuscleGroupData = async (
  userId: string,
  muscleGroup: MuscleGroup,
  category: ExerciseCategory,
  startDate = new Date(),
  endDate = new Date(),
) => {
  
  const data = await prisma.exerciseLog.findMany({
    where: {
      WorkoutLog: {
        userId: userId,
      },
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      exercise: {
        muscleGroup,
        category
      },
    },

    select: {
      [ExerciseFilterOptions[category]]: true,
      createdAt: true,
    },
  });

  const diffInDates = differenceInCalendarDays(endDate, startDate);
  const dayVolArr: number[] = Array(diffInDates).fill(0);  

  data.forEach((record) => {
    // @ts-expect-error The data from Prisma is fine but due to 
    // [ExerciseFilterOptions[category]]: true, ts can't infer type properly.
    const index = differenceInCalendarDays(record.createdAt, startDate);
    // @ts-expect-error same as above
    dayVolArr[index] += record[ExerciseFilterOptions[category]]; 
  });

  const result = dayVolArr.map((val, index) => ({name: index.toString(), val}));
  
  return result;
};
