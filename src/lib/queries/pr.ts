import { Prisma } from "@/generated/prisma/client";
import prisma from "../db";
import { getNoOfPRsQuery } from "./user";
import { safeQuery } from "../safeQueries";

export const changePRFieldQuery = async (
  userId: string,
  prId: string,
  exerciseId: string,
  newField: string
) => {
  return safeQuery(async () => {
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
  });
};

export const getRecentPersonalRecordsQuery = async (userId: string) => {
  return safeQuery(async () => {
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
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      getNoOfPRsQuery(userId),
    ]);

    if (countOfTotalPRs.error) throw countOfTotalPRs.error;

    return { prs, countOfTotalPRs: countOfTotalPRs.data };
  });
};

export const getPersonalRecordsQuery = async (
  userId: string,
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
  search: string = ""
) => {
  return safeQuery(async () => {
    const findArgs: Prisma.PRFindManyArgs = {
      take: direction === "next" ? 5 : -5,
      where: {
        userid: userId,
        ...(search && {
          exercise: { is: { name: { contains: search, mode: "insensitive" } } },
        }),
      },
      ...(cursor && {
        skip: 1,
        cursor: { createdAt: cursor.createdAt, id: cursor.id },
      }),
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
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    };

    const data = await prisma.pR.findMany(findArgs);

    return data;
  });
};

export const getPROwner = async (prId: string) => {
  return safeQuery(async () => {
    const pr = await prisma.pR.findUnique({
      where: {
        id: prId,
      },
      select: {
        userid: true,
      },
    });

    return pr?.userid;
  });
};
