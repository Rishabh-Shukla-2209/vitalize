"use server";

import { GoalStatus } from "@/generated/prisma/enums";
import { ensureOwnership, requireUser } from "../auth";
import {
  getActiveGoalsQuery,
  getGoalsQuery,
  getAllExercisesQuery,
  addGoalQuery,
  abandonGoalQuery,
  getGoalOwner,
} from "../queries/goal";

export const getActiveGoals = async () => {
  const userId = await requireUser();

  const { data, error } = await getActiveGoalsQuery(userId);

  if (error) throw error;
  return data;
};

export const getGoals = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
  search: string = "",
  status?: GoalStatus | "All",
) => {
  const userId = await requireUser();

  const { data, error } = await getGoalsQuery(
    userId,
    cursor,
    direction,
    search,
    status,
  );

  if (error) throw error;
  return data;
};

export const getAllExercises = async () => {
  await requireUser();
  const { data, error } = await getAllExercisesQuery();

  if (error) throw error;
  return data;
};

export const addGoal = async (data: {
  title: string;
  targetExerciseid: string;
  targetField: string;
  currentValue: number;
  targetValue: number;
  initialValue: number;
  targetDate: Date;
}) => {
  const userId = await requireUser();

  const { data: newGoal, error } = await addGoalQuery({
    userid: userId,
    ...data,
  });

  if (error) throw error;
  return newGoal;
};

export const abandonGoal = async (goalId: string) => {
  const userId = await requireUser();
  const { data: ownerId, error } = await getGoalOwner(goalId);
  if (error) throw error;

  ensureOwnership(ownerId, userId);

  const { data, error: abandonError } = await abandonGoalQuery(goalId);

  if (abandonError) throw abandonError;
  return data;
};
