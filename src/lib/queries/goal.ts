import { startOfToday } from "date-fns";
import prisma from "../db";
import { Prisma } from "@/generated/prisma/client";
import { GoalStatus } from "@/generated/prisma/enums";
import { safeQuery } from "../safeQueries";

export const getActiveGoalsQuery = async (userId: string) => {
  return safeQuery(async () => {
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
            category: true,
          },
        },
        status: true,
        targetValue: true,
        targetField: true,
        currentValue: true,
        initialValue: true,
        targetDate: true,
        createdAt: true,
      },
    });
    const missedGoals = data.filter((goal) => goal.targetDate < startOfToday());
    const activeGoals = data.filter(
      (goal) => goal.targetDate >= startOfToday(),
    );

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
  });
};

export const getGoalsQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
  search: string = "",
  status?: GoalStatus | "All",
) => {
  return safeQuery(async () => {
    const findArgs: Prisma.GoalFindManyArgs = {
      take: direction === "next" ? 5 : -5,
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
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
            category: true,
          },
        },
        status: true,
        targetValue: true,
        targetField: true,
        currentValue: true,
        initialValue: true,
        targetDate: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    };

    const goals = await prisma.goal.findMany(findArgs);

    return goals;
  });
};

export const getAllExercisesQuery = async () => {
  return safeQuery(async () => {
    const data = await prisma.exerciseCatalog.findMany({
      select: {
        id: true,
        name: true,
        category: true,
      },
    });

    return data;
  });
};

export const addGoalQuery = async (data: {
  userid: string;
  title: string;
  targetExerciseid: string;
  targetField: string;
  currentValue: number;
  targetValue: number;
  initialValue: number;
  targetDate: Date;
}) => {
  return safeQuery(async () => {
    await prisma.goal.create({ data });
  });
};

export const abandonGoalQuery = async (goalId: string) => {
  return safeQuery(async () => {
    await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        status: "ABANDONED",
      },
    });
  });
};

export const getGoalOwner = async (goalId: string) => {
  return safeQuery(async () => {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      select: { userid: true },
    });
    return goal?.userid;
  });
};
