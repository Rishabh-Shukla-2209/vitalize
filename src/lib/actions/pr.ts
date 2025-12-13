"use server";

import { ensureOwnership, requireUser } from "../auth";
import {
  changePRFieldQuery,
  getPersonalRecordsQuery,
  getPROwner,
  getRecentPersonalRecordsQuery,
} from "../queries/pr";

export const changePRField = async (
  prId: string,
  exerciseId: string,
  newField: string,
) => {
  const userId = await requireUser();
  const { data: prOwnerId, error: ownerError } = await getPROwner(prId);
  if (ownerError) throw ownerError;
  ensureOwnership(prOwnerId, userId);

  const { data, error } = await changePRFieldQuery(
    userId,
    prId,
    exerciseId,
    newField,
  );

  if (error) throw error;
  return data;
};

export const getRecentPersonalRecords = async () => {
  const userId = await requireUser();

  const { data, error } = await getRecentPersonalRecordsQuery(userId);

  if (error) throw error;
  return data;
};

export const getPersonalRecords = async (
  cursor: { createdAt: Date; id: string } | null,
  direction: "next" | "prev",
  search: string = "",
) => {
  const userId = await requireUser();

  const { data, error } = await getPersonalRecordsQuery(
    userId,
    cursor,
    direction,
    search,
  );

  if (error) throw error;
  return data;
};
