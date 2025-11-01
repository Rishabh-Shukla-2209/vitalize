"use server";

import prisma from "@/lib/prisma";
import {
  addDays,
  differenceInCalendarDays,
  format,
  getDate,
  getMonth,
  getYear,
  isSameDay,
  startOfToday,
  subDays,
} from "date-fns";
import { dayName, ExerciseFilterOptions } from "./utils";
import {
  DifficultyType,
  EquipmentType,
  ExerciseCategoryType,
  MuscleGroupType,
  WorkoutLogDataType,
} from "./types";
import { Gender, Prisma, Status } from "@/generated/prisma";

export const createUser = async (id: string, email: string) => {
  if (await prisma.user.findUnique({ where: { id } })) return;

  const user = await prisma.user.create({
    data: {
      id,
      email,
    },
  });

  return user;
};

export const updateUser = async (
  id: string, 
  data: {
    imgUrl? : string,
    about? : string,
    bio? : string
  }
) => {
  
  await prisma.user.update({
    where: {
      id
    },
    data
  })
}

export const saveOnboardingData = async (
  id: string,
  firstName: string,
  lastName: string,
  imgUrl: string,
  weight: number,
  height: number,
  gender: Gender,
  dob: Date
) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      firstName,
      lastName,
      gender,
      imgUrl,
      dateOfBirth: dob,
    },
  });

  await prisma.measurement.create({
    data: {
      user: { connect: { id } },
      height,
      weight,
    },
  });
};

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
      lastActiveOn: true,
    },
  });

  if (
    streaks?.currentStreakDays === 0 ||
    (streaks?.lastActiveOn &&
      (isSameDay(subDays(new Date(), 1), streaks.lastActiveOn) ||
        isSameDay(new Date(), streaks.lastActiveOn)))
  ) {
    return streaks;
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      currentStreakDays: 0,
    },
  });

  return {
    currentStreakDays: 0,
    longestStreakDays: streaks?.longestStreakDays,
  };
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

  if (result.lastActiveOn < startOfToday()) {
    return false;
  }

  return true;
};

export const getExerciseCatData = async (
  userId: string,
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date()
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
};

export const getMuscleGroupData = async (
  userId: string,
  muscleGroup: MuscleGroupType,
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date()
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
};

export const getWorkoutPlans = async (
  search: string,
  muscleGroup: MuscleGroupType | "" = "",
  equipment: EquipmentType | "" = "",
  difficulty: DifficultyType | "" = "",
  duration: string = "",
  userId: string | null = null
) => {
  const andConditions: Prisma.WorkoutPlanWhereInput[] = [];
  const whereClause: Prisma.WorkoutPlanWhereInput = {};

  if (difficulty) {
    andConditions.push({ level: difficulty });
  }

  if (duration) {
    const [min, max] = duration.split(",").map(Number);
    andConditions.push({
      duration: {
        gte: min,
        lte: max,
      },
    });
  }

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (muscleGroup || equipment) {
    andConditions.push({
      exercises: {
        some: {
          exercise: {
            ...(muscleGroup && muscleGroup !== "FULL_BODY" && { muscleGroup }),
            ...(equipment && { equipment }),
          },
        },
      },
    });
  }

  if (userId) {
    andConditions.push({
      OR: [{ userId: null }, { userId }],
    });
  }

  if (andConditions.length > 0) {
    whereClause.AND = andConditions;
  }

  const data = await prisma.workoutPlan.findMany({
    where: whereClause,
  });

  return data;
};

export const getWorkoutDetails = async (id: string) => {
  const data = await prisma.workoutPlan.findUnique({
    where: {
      id,
    },
    include: {
      exercises: {
        include: {
          exercise: {
            select: {
              equipment: true,
              muscleGroup: true,
              name: true,
              category: true,
              instructions: true,
              imgUrl: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return data;
};

export const getPastWorkouts = async (
  userId: string,
  date: Date | undefined | "" = "",
  muscleGroup: MuscleGroupType | "" = ""
) => {
  const whereClause: Prisma.WorkoutLogWhereInput = { userId };

  if (date) {
    whereClause.createdAt = {
      gte: date,
      lt: addDays(date, 1),
    };
  }

  if (muscleGroup) {
    whereClause.exercises = {
      some: {
        exercise: { muscleGroup },
      },
    };
  }

  const data = await prisma.workoutLog.findMany({
    where: whereClause,
    include: {
      exercises: {
        include: {
          exercise: {
            select: {
              name: true,
            },
          },
        },
      },
      plan: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
};

export const saveWorkoutLog = async (
  userId: string,
  planId: string,
  workoutData: WorkoutLogDataType
) => {
  const exercises: Prisma.ExerciseLogCreateWithoutWorkoutLogInput[] = [];

  for (const category of Object.keys(workoutData)) {
    if (category !== "duration" && category !== "notes") {
      const catEx = workoutData[category as keyof WorkoutLogDataType];

      if (Array.isArray(catEx)) {
        catEx.forEach((ex) => {
          const { exerciseId, ...rest } = ex;
          const exLog: Prisma.ExerciseLogCreateWithoutWorkoutLogInput = {
            exercise: { connect: { id: exerciseId } },
            ...rest,
          };
          exercises.push(exLog);
        });
      }
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const timeNow = new Date();

      await tx.workoutLog.create({
        data: {
          user: { connect: { id: userId } },
          plan: { connect: { id: planId } },
          duration: workoutData.duration,
          notes: workoutData.notes,
          createdAt: timeNow,
          exercises: {
            create: exercises,
          },
        },
      });

      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      let currentStreak = user.currentStreakDays || 1;
      let longestStreak = user.longestStreakDays || 1;

      if (user.lastActiveOn) {
        if (!isSameDay(timeNow, user.lastActiveOn)) {
          if (isSameDay(user.lastActiveOn, subDays(timeNow, 1))) {
            currentStreak += 1;
            if (currentStreak > user.longestStreakDays) {
              longestStreak = currentStreak;
            }
          } else {
            currentStreak = 1;
          }
        }
      }

      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          currentStreakDays: currentStreak,
          longestStreakDays: longestStreak,
          lastActiveOn: timeNow,
        },
      });

      const pRs = await tx.pR.findMany({
        where: {
          userid: userId,
        },
        select: {
          prField: true,
          prValue: true,
          exerciseid: true,
        },
      });

      const prExIds = pRs.map((pr) => pr.exerciseid);
      const prMap = new Map(pRs.map((pr) => [pr.exerciseid, pr]));

      const prsToUpdate: Array<{ key: string; val: Prisma.PRUpdateInput }> = [];
      const prsToAdd: Prisma.PRCreateManyInput[] = [];

      const goals = await getActiveGoals(userId);
      const goalsExIds = goals.map((goal) => goal.targetExercise.id);
      const goalsToUpdate: Array<{ key: string; val: Prisma.GoalUpdateInput }> =
        [];

      for (const category of Object.keys(workoutData)) {
        if (category !== "duration" && category !== "notes") {
          const catEx = workoutData[category as keyof WorkoutLogDataType];

          if (Array.isArray(catEx)) {
            catEx.forEach((ex) => {
              const { exerciseId } = ex;
              if (prExIds.includes(exerciseId)) {
                const existingPr = prMap.get(exerciseId);
                const newValue = ex[
                  existingPr!.prField as keyof typeof ex
                ] as number;
                if (existingPr && existingPr.prValue < newValue) {
                  prsToUpdate.push({
                    key: existingPr.exerciseid,
                    val: { prValue: newValue },
                  });
                }
              } else {
                const newPrField =
                  ExerciseFilterOptions[
                    category.toUpperCase() as ExerciseCategoryType
                  ];
                prsToAdd.push({
                  prField: newPrField,
                  prValue: ex[newPrField as keyof typeof ex] as number,
                  exerciseid: exerciseId,
                  userid: userId,
                });
              }

              if (goalsExIds.includes(exerciseId)) {
                const goal = goals.find(
                  (goal) => goal.targetExercise.id === exerciseId
                );
                const newValue = ex[
                  goal!.targetField as keyof typeof ex
                ] as number;
                if (goal && goal.currentValue < newValue) {
                  if (newValue >= goal.targetValue) {
                    goalsToUpdate.push({
                      key: goal.id,
                      val: { currentValue: newValue, status: "ACHIEVED" },
                    });
                  } else {
                    goalsToUpdate.push({
                      key: goal.id,
                      val: { currentValue: newValue },
                    });
                  }
                }
              }
            });
          }
        }
      }

      if (prsToAdd.length > 0) {
        await tx.pR.createMany({
          data: prsToAdd,
        });
      }

      await Promise.all(
        prsToUpdate.map((pr) =>
          tx.pR.update({
            where: {
              userid_exerciseid: {
                exerciseid: pr.key,
                userid: userId,
              },
            },
            data: pr.val,
          })
        )
      );

      await Promise.all(
        goalsToUpdate.map((goal) =>
          tx.goal.update({
            where: {
              id: goal.key,
            },
            data: goal.val,
          })
        )
      );
    });
  } catch (err) {
    console.error("Error saving workout log:", err);
    throw new Error("Failed to save workout log");
  }
};

export const getActiveGoals = async (userId: string) => {
  const data = await prisma.goal.findMany({
    where: {
      userid: userId,
      status: "IN_PROGRESS",
    },
    select: {
      id: true,
      title: true,
      targetExercise: {
        select: {
          name: true,
          id: true,
          category: true
        },
      },
      status: true,
      targetValue: true,
      targetField: true,
      currentValue: true,
      initialValue: true,
      targetDate: true,
    },
  });
  const missedGoals = data.filter((goal) => goal.targetDate < startOfToday());
  const activeGoals = data.filter((goal) => goal.targetDate >= startOfToday());

  if (missedGoals.length > 0) {
    await prisma.goal.updateMany({
      where: {
        id: {
          in: missedGoals.map((goal) => goal.id),
        },
        userid: userId,
      },
      data: {
        status: "MISSED",
      },
    });
  }

  return activeGoals;
};

export const changePRField = async (
  userId: string,
  prId: string,
  exerciseId: string,
  newField: string
) => {
  const newPRValue = await prisma.exerciseLog.aggregate({
    _max: {
      [newField]: true,
    },
    where: {
      WorkoutLog: {
        userId,
      },
      exerciseid: exerciseId,
    },
  });

  await prisma.pR.update({
    where: {
      id: prId,
    },
    data: {
      prField: newField,
      prValue: newPRValue._max[newField],
    },
  });

  return newPRValue._max[newField];
};

export const getRecentPersonalRecords = async (userId: string) => {
  const [prs, countOfTotalPRs] = await Promise.all([
    prisma.pR.findMany({
      take: 11,
      where: {
        userid: userId,
      },
      select: {
        id: true,
        prField: true,
        prValue: true,
        exercise: {
          select: {
            name: true,
            category: true,
            id: true,
          },
        },
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),

    getNoOfPRs(userId),
  ]);

  return { prs, countOfTotalPRs };
};

export const getPersonalRecords = async (
  userId: string,
  cursor: string | null,
  direction: "next" | "prev",
  search: string = ""
) => {
  const findArgs: Prisma.PRFindManyArgs = {
    take: direction === "next" ? 5 : -5,
    where: {
      userid: userId,
      ...(search && {
        exercise: { is: { name: { contains: search, mode: "insensitive" } } },
      }),
    },
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    select: {
      id: true,
      prField: true,
      prValue: true,
      exercise: {
        select: {
          name: true,
          category: true,
          id: true,
        },
      },
      updatedAt: true,
    },
    orderBy: {
      id: "asc",
    },
  };

  const data = await prisma.pR.findMany(findArgs);

  return data;
};

export const getAvailableExercises = async (
  muscleGroups: Array<MuscleGroupType>,
  category: ExerciseCategoryType
) => {
  const whereClause: Prisma.ExerciseCatalogWhereInput = {};

  if (muscleGroups.length > 0) {
    whereClause.muscleGroup = { in: muscleGroups };
  }

  if (category) {
    whereClause.category = category;
  }

  const data = await prisma.exerciseCatalog.findMany({
    where: whereClause,
    select: {
      name: true,
      id: true,
    },
  });

  return data;
};

export const saveAiWorkout = async (data: Prisma.WorkoutPlanCreateInput) => {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const savedWorkout = await prisma.workoutPlan.create({ data });
      return savedWorkout.id;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const uniqueSuffix = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
        data = { ...data, name: `${data.name}-${uniqueSuffix}` };
        attempt++;
      } else {
        throw error;
      }
    }
  }

  throw new Error("Failed to save unique workout after several retries");
};

export const getNoOfPRs = async (userId: string) => {
  return await prisma.pR.count({
    where: {
      userid: userId,
    },
  });
};

export const getNoOfWorkoutsDone = async (userId: string) => {
  return await prisma.workoutLog.count({
    where: {
      userId,
    },
  });
};

export const getUser = async (userId?: string | undefined) => {
  if(!userId) return null;

  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  });

  return data;
};

export const getGoals = async (
  userId: string,
  cursor: string | null,
  direction: "next" | "prev",
  search: string = "",
  status?: Status|"All"
) => {
  const findArgs: Prisma.GoalFindManyArgs = {
    take: direction === "next" ? 5 : -5,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    where: {
      userid: userId,
      ...(status && status !== "All" && { status }),
      ...(search && {
        targetExercise: {
          is: { name: { contains: search, mode: "insensitive" } },
        },
      }),
    },
    select: {
      id: true,
      title: true,
      targetExercise: {
        select: {
          name: true,
          id: true,
          category: true
        },
      },
      status: true,
      targetValue: true,
      targetField: true,
      currentValue: true,
      initialValue: true,
      targetDate: true,
    },
    orderBy: {
      id: "asc",
    },
  };

  const goals = await prisma.goal.findMany(findArgs);

  return goals;
};

export const getAllExercises = async () => {
  const data = await prisma.exerciseCatalog.findMany({
    select:{
      id: true,
      name: true,
      category: true
    }
  });

  return data;
}

export const addGoal = async (
  data: {
    userid: string;
    title: string;
    targetExerciseid: string;
    targetField: string;
    currentValue: number;
    targetValue: number;
    initialValue: number;
    targetDate: Date;
}) => {
  await prisma.goal.create({data});
}

export const abandonGoal = async (goalId: string) => {
  await prisma.goal.update({
    where: {
      id: goalId
    },
    data: {
      status: "ABANDONED"
    }
  })
}

export const getUserAIWorkouts = async (userId: string, cursor: string|null, direction: "next"|"prev") => {
  
  const findArgs: Prisma.WorkoutPlanFindManyArgs = {
    take: direction === "next" ? 5 : -5,
    where: {
      userId,
    },
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    select: {
      id: true,
      name: true
    },
    orderBy: {
      id: "asc",
    },
  }

  const data = await prisma.workoutPlan.findMany(findArgs);

  return data;
}