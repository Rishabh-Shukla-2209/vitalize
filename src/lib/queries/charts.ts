import {
  differenceInCalendarDays,
  format,
  getDate,
  getMonth,
  getYear,
  startOfToday,
  subDays,
} from "date-fns";
import prisma from "../db";
import { dayName, ExerciseFilterOptions } from "../utils";
import { ExerciseCategoryType, MuscleGroupType } from "../types";
import { safeQuery } from "../safeQueries";

export const getLastWeekVolQuery = async (userId: string) => {
  return safeQuery(async () => {
    const earliestDate = subDays(new Date(), 7);

    //get last 7 days exercise data in the format {sets, reps, createdAt}[]

    const rawData = await prisma.exerciseLog.findMany({
      where: {
        WorkoutLog: {
          userId: userId,
        },
        createdAt: {
          gte: earliestDate,
          lte: startOfToday(),
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
  });
};

export const getCurrMonthsWorkoutDatesQuery = async (userId: string) => {
  return safeQuery(async () => {
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
  });
};

export const getExerciseCatDataQuery = async (
  userId: string,
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date()
) => {
  return safeQuery(async () => {
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
          category,
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

    const result = dayVolArr.map((val, index) => ({
      name: index.toString(),
      val,
    }));

    return result;
  });
};

export const getMuscleGroupDataQuery = async (
  userId: string,
  muscleGroup: MuscleGroupType,
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date()
) => {
  return safeQuery(async () => {
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
          category,
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

    const result = dayVolArr.map((val, index) => ({
      name: index.toString(),
      val,
    }));

    return result;
  });
};
