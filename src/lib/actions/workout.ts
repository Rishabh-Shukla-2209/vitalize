"use server";

import { requireUser } from "../auth";
import {
  getWorkoutPlansQuery,
  getWorkoutDetailsQuery,
  getPastWorkoutsQuery,
  saveWorkoutLogQuery,
} from "../queries/workouts";
import {
  DifficultyType,
  EquipmentType,
  MuscleGroupType,
  WorkoutLogDataType,
} from "../types";

export const getWorkoutPlans = async (
  search: string,
  muscleGroup: MuscleGroupType | "" = "",
  equipment: EquipmentType | "" = "",
  difficulty: DifficultyType | "" = "",
  duration: string = "",
  pageParam: number = 0
) => {
  const userId = await requireUser();

  const { data, error } = await getWorkoutPlansQuery(
    search,
    muscleGroup,
    equipment,
    difficulty,
    duration,
    userId,
    pageParam
  );

  if (error) throw error;
  return data;
};

export const getWorkoutDetails = async (id: string) => {
  await requireUser();

  const { data, error } = await getWorkoutDetailsQuery(id);

  if (error) throw error;
  return data;
};

export const getPastWorkouts = async (
  date: Date | undefined | "" = "",
  muscleGroup: MuscleGroupType | "" = "",
  pageParam: number = 0
) => {
  const userId = await requireUser();

  const { data, error } = await getPastWorkoutsQuery(userId, date, muscleGroup, pageParam);

  if (error) throw error;
  return data;
};

export const saveWorkoutLog = async (
  planId: string,
  workoutData: WorkoutLogDataType
) => {
  const userId = await requireUser();

  const { data, error } = await saveWorkoutLogQuery(
    userId,
    planId,
    workoutData
  );

  if (error) throw error;
  return data;
};
