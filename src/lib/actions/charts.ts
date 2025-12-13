"use server";

import { ExerciseCategoryType, MuscleGroupType } from "../types";
import { requireUser } from "../auth";
import {
  getCurrMonthsWorkoutDatesQuery,
  getExerciseCatDataQuery,
  getLastWeekVolQuery,
  getMuscleGroupDataQuery,
} from "../queries/charts";
import { ValidationError } from "../errors";

export const getLastWeekVol = async () => {
  const userId = await requireUser();

  const { data, error } = await getLastWeekVolQuery(userId);

  if (error) throw error;
  return data;
};

export const getCurrMonthsWorkoutDates = async () => {
  const userId = await requireUser();

  const { data, error } = await getCurrMonthsWorkoutDatesQuery(userId);

  if (error) throw error;
  return data;
};

export const getExerciseCatData = async (
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date(),
) => {
  const userId = await requireUser();

  if (startDate > endDate) throw new ValidationError();

  const { data, error } = await getExerciseCatDataQuery(
    userId,
    category,
    startDate,
    endDate,
  );

  if (error) throw error;
  return data;
};

export const getMuscleGroupData = async (
  muscleGroup: MuscleGroupType,
  category: ExerciseCategoryType,
  startDate = new Date(),
  endDate = new Date(),
) => {
  const userId = await requireUser();

  if (startDate > endDate) throw new ValidationError();

  const { data, error } = await getMuscleGroupDataQuery(
    userId,
    muscleGroup,
    category,
    startDate,
    endDate,
  );

  if (error) throw error;
  return data;
};
