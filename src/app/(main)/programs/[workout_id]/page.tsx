import Exercise from "@/components/Exercise";
import Icons from "@/components/icons/appIcons";
import { Button } from "@/components/ui/button";
import { getWorkoutDetails } from "@/lib/queries";
import { toProperCase } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProgramDetailPage = async ({
  params,
}: {
  params: { workout_id: string };
}) => {
  const { workout_id } = await params;
  const workout = await getWorkoutDetails(workout_id);

  if (!workout) {
    return <p>Workout not found</p>;
  }
  const equipments = workout.exercises
    .map((planExercise) => planExercise.exercise.equipment)
    .filter((equipment) => equipment !== "NONE" && equipment !== null);

  const muscles = workout.exercises.map(
    (planExercise) => planExercise.exercise.muscleGroup
  );
  const uniqueEquipments = [...new Set(equipments)];
  const uniqueMuscles = [...new Set(muscles)];

  return (
    <div className="py-8 px-60">
      <h1 className="text-3xl font-semibold text-zinc-600">{workout.name}</h1>
      <div className="flex items-center gap-1 my-1.5">
        <div
          className={clsx(
            "border text-sm text-white font-bold py-1 px-1.5 rounded-r-full rounded-l-full",
            { "bg-red-600": workout.level === "ADVANCED" },
            { "bg-amber-400": workout.level === "INTERMEDIATE" },
            { "bg-green-500": workout.level === "BEGINNER" }
          )}
        >
          {workout.level}
        </div>
        <div className="text-2xl">•</div>
        <p className="text-zinc-600">{workout.duration} minutes</p>
      </div>
      <div className="h-100 w-full relative mt-3">
        <Image
          src={workout.imgUrl ? workout.imgUrl : "/workoutPlanImg.png"}
          alt="Workout Image"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg border"
        />
      </div>

      <div className="flex w-full mt-5 gap-5">
        <div className="flex-4 bg-zinc-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-zinc-700 mb-1.5">
            Workout Overview
          </h3>
          <p className="text-zinc-600">{workout.description}</p>
          <div className="flex gap-2 mt-1">
            <h4 className="text-zinc-600 font-semibold">Muscles Involved: </h4>
            {uniqueMuscles.map((muscles, index) => (
              <p key={index} className="flex gap-1 text-zinc-600">
                • {toProperCase(muscles)}
              </p>
            ))}
          </div>
        </div>
        <div className="flex-2 bg-zinc-100 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-zinc-700 mb-1.5">
            Required Equipments
          </h3>
          <div className="flex flex-wrap gap-3 items-center">
            {uniqueEquipments.length > 0 ? (
              uniqueEquipments.map((equipment, index) => (
                <p key={index} className="flex gap-1 text-zinc-600">
                  <Icons.dumbell className="text-primary-dark" />
                  {toProperCase(equipment!)}
                </p>
              ))
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-zinc-700 my-3">Exercises</h2>
        <div className="bg-zinc-100 rounded-lg">
          {workout.exercises.map((planExercise) => (
            <Exercise key={planExercise.id} exercise={planExercise} />
          ))}
        </div>
      </div>
      <div className="mt-3">
        <Link href={`/workouts/${workout_id}`}>
          <Button
            variant="default"
            className="w-full h-12 text-lg font-semibold"
          >
            Start Workout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
