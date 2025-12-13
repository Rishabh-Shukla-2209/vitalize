import { Prisma } from "@/generated/prisma/client";
import {
  DifficultyType,
  EquipmentType,
  ExerciseCategoryType,
  MuscleGroupType,
  WorkoutLogDataType,
} from "../types";
import prisma from "../db";
import { addDays, isSameDay, subDays } from "date-fns";
import { ExerciseFilterOptions } from "../utils";
import { getActiveGoalsQuery } from "./goal";
import { safeQuery } from "../safeQueries";

export const getWorkoutPlansQuery = async (
  search: string,
  muscleGroup: MuscleGroupType | "" = "",
  equipment: EquipmentType | "" = "",
  difficulty: DifficultyType | "" = "",
  duration: string = "",
  pageParam: number = 0,
) => {
  return safeQuery(async () => {
    const andConditions: Prisma.WorkoutPlanWhereInput[] = [];
    const whereClause: Prisma.WorkoutPlanWhereInput = { userId: null };

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
              ...(muscleGroup &&
                muscleGroup !== "FULL_BODY" && { muscleGroup }),
              ...(equipment && { equipment }),
            },
          },
        },
      });
    }

    if (andConditions.length > 0) {
      whereClause.AND = andConditions;
    }

    const data = await prisma.workoutPlan.findMany({
      where: whereClause,
      skip: pageParam * 20,
      take: 20,
    });

    const nextPage = data.length < 20 ? null : pageParam + 1;

    return { data, nextPage };
  });
};

export const getWorkoutDetailsQuery = async (id: string) => {
  return safeQuery(async () => {
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
  });
};

export const getPastWorkoutsQuery = async (
  userId: string,
  date: Date | undefined | "" = "",
  muscleGroup: MuscleGroupType | "" = "",
  pageParam: number = 0,
) => {
  return safeQuery(async () => {
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
      skip: pageParam * 10,
      take: 10,
    });

    const nextPage = data.length < 10 ? null : pageParam + 1;

    return { data, nextPage };
  });
};

export const saveWorkoutLogQuery = async (
  userId: string,
  planId: string,
  workoutData: WorkoutLogDataType,
) => {
  return safeQuery(async () => {
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

        const prsToUpdate: Array<{ key: string; val: Prisma.PRUpdateInput }> =
          [];
        const prsToAdd: Prisma.PRCreateManyInput[] = [];

        const { data: goals, error } = await getActiveGoalsQuery(userId);
        if (error) throw error;

        const goalsExIds = goals!.map((goal) => goal.targetExercise.id);
        const goalsToUpdate: Array<{
          key: string;
          val: Prisma.GoalUpdateInput;
        }> = [];

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
                  const goal = goals!.find(
                    (goal) => goal.targetExercise.id === exerciseId,
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
            }),
          ),
        );

        await Promise.all(
          goalsToUpdate.map((goal) =>
            tx.goal.update({
              where: {
                id: goal.key,
              },
              data: goal.val,
            }),
          ),
        );
      });
    } catch (err) {
      console.error("Error saving workout log:", err);
      throw new Error("Failed to save workout log");
    }
  });
};
