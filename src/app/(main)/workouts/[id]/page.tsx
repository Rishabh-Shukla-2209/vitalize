"use client";

import Icons from "@/components/icons/appIcons";
import { getWorkoutDetails } from "@/lib/db";
import { WorkoutPlanDetailsType } from "@/lib/types";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { toProperCase } from "@/lib/utils";
import { useWorkoutFlow } from "@/hooks/useWorkoutFlow";

const WorkoutPage = () => {
  const params = useParams();
  const id = params.id;
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanDetailsType | null>(
    null
  );
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const {
    currWorkoutItem,
    nextWorkoutItem,
    prevWorkoutItem,
    pauseWorkout,
    timeRemaining,
    isPaused,
    status,
    dispatch,
    hasEnded,
    handleEndWorkout,
  } = useWorkoutFlow(workoutPlan);

  useEffect(() => {
    async function getData(workoutId: string) {
      const data = await getWorkoutDetails(workoutId);
      setWorkoutPlan(data);
      if (data) {
        dispatch({
          type: "PUSH",
          payload: {
            exercise: data.exercises[0],
            type: "work",
            currValues: {
              set: 1,
              reps: data.exercises[0].reps,
              distance: data.exercises[0].distance,
              time: data.exercises[0].time,
            },
          },
        });
      }
    }
    if (typeof id === "string") getData(id);
  }, [id, dispatch]);

  if (typeof id !== "string") {
    return <p>Invalid workout ID</p>;
  }

  return (
    <div className="flex-center">
      {workoutPlan ? (
        <div className="flex flex-col items-center min-w-100 gap-5">
          <div className="bg-zinc-100 flex-5 mt-10 p-5 text-center w-full rounded-lg">
            <h1 className="text-3xl font-semibold text-zinc-600 mb-1">
              {workoutPlan.name}
            </h1>
            <p className="text-zinc-600">
              <span>{toProperCase(workoutPlan.level)} </span>
              <span>•</span>
              <span> {workoutPlan.duration} minutes</span>
            </p>
            <div className="flex justify-between gap-1.5 my-3">
              <div className="bg-zinc-400 h-1.5 w-full rounded-l-full rounded-r-full" />
              <div className="bg-zinc-400 h-1.5 w-full rounded-l-full rounded-r-full" />
              <div className="bg-zinc-400 h-1.5 w-full rounded-l-full rounded-r-full" />
            </div>
            <div className="bg-zinc-300 rounded-lg p-5 ">
              <p className="text-zinc-700 text-lg">Current Exercise</p>
              {currWorkoutItem && (
                <>
                  <h2 className="text-4xl font-semibold text-zinc-600 mb-1">
                    {currWorkoutItem.exercise!.exercise.name}
                  </h2>
                  <p className="text-zinc-700 text-lg">
                    {currWorkoutItem.exercise!.sets > 0 && (
                      <span>{currWorkoutItem.exercise!.sets} sets • </span>
                    )}
                    {currWorkoutItem.exercise!.reps > 0 && (
                      <span>{currWorkoutItem.exercise!.reps} reps • </span>
                    )}
                    {currWorkoutItem.exercise!.distance && (
                      <span>{currWorkoutItem.exercise!.distance}m • </span>
                    )}
                    {currWorkoutItem.exercise!.time && (
                      <span>{currWorkoutItem.exercise!.time}s • </span>
                    )}
                    {currWorkoutItem.exercise!.rest > 0 && (
                      <span>{currWorkoutItem.exercise!.rest}s rest</span>
                    )}
                  </p>
                </>
              )}
            </div>
            <h3 className="text-lg font-semibold text-zinc-600 my-1">
              {status === "work" ? "Work" : "Rest"}
            </h3>
            <h2
              className={clsx(
                "font-bold text-zinc-600",
                { "text-6xl": status === "rest" },
                { "text-4xl mb-8": status === "work" }
              )}
            >
              {status === "work"
                ? `Set ${currWorkoutItem?.currValues.set}: ${
                    currWorkoutItem!.currValues.reps > 0
                      ? `${currWorkoutItem?.currValues.reps} Reps`
                      : ""
                  } ${
                    currWorkoutItem?.currValues.distance
                      ? `${currWorkoutItem.currValues.distance}m`
                      : ""
                  } ${
                    currWorkoutItem?.currValues.time
                      ? `0${Math.floor(timeRemaining / 60)} : ${
                          timeRemaining % 60 < 10 ? "0" : ""
                        }${timeRemaining % 60}`
                      : ""
                  }`
                : `0${Math.floor(timeRemaining / 60)} : ${
                    timeRemaining % 60 < 10 ? "0" : ""
                  }${timeRemaining % 60}`}
            </h2>
            <div className="flex justify-between gap-5 mt-3">
              <button
                className="flex-1 flex-center bg-zinc-300 text-zinc-700 py-3 px-10 rounded-l-full rounded-r-full hover:bg-zinc-400 hover:text-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:hover:cursor-default"
                onClick={prevWorkoutItem}
                disabled={!workoutStarted || hasEnded}
              >
                <Icons.left />
              </button>
              <button
                className="flex-1 flex-center bg-zinc-300 text-zinc-700 py-3 px-10 rounded-l-full rounded-r-full hover:bg-zinc-400 hover:text-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:hover:cursor-default"
                onClick={nextWorkoutItem}
                disabled={!workoutStarted || hasEnded}
              >
                <Icons.right />
              </button>
            </div>
          </div>
          <button
            className="flex-1 flex-center w-full bg-zinc-300 font-semibold text-lg text-zinc-800 py-4 px-10 rounded-l-full rounded-r-full hover:bg-zinc-400 hover:text-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:hover:cursor-default"
            onClick={pauseWorkout}
            disabled={!workoutStarted || hasEnded}
          >
            {isPaused ? <Icons.play /> : <Icons.pause />} {"  "}
            {isPaused ? "Resume" : "Pause"} workout
          </button>
          {workoutStarted ? (
            hasEnded ? (
              <Link
                href={`/workouts/log-workout/${workoutPlan.id}`}
                className="w-full"
              >
                <button className="flex-1 flex-center w-full text-white font-semibold text-lg py-4 px-10 rounded-l-full rounded-r-full bg-primary-dark hover:bg-green-500">
                  {" "}
                  Log Workout
                </button>
              </Link>
            ) : (
              <button
                className="flex-1 flex-center w-full text-white font-semibold text-lg py-4 px-10 rounded-l-full rounded-r-full bg-red-500 hover:bg-red-700"
                onClick={handleEndWorkout}
              >
                {" "}
                End Workout
              </button>
            )
          ) : (
            <button
              className="flex-1 flex-center w-full text-white font-semibold text-lg py-4 px-10 rounded-l-full rounded-r-full bg-primary-dark hover:bg-green-500"
              onClick={() => setWorkoutStarted(true)}
            >
              Start Workout
            </button>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WorkoutPage;
