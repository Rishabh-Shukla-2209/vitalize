"use client";

import { Button } from "@/components/ui/button";
import Balance from "@/components/workoutLog/Balance";
import Cardio from "@/components/workoutLog/Cardio";
import Core from "@/components/workoutLog/Core";
import Endurance from "@/components/workoutLog/Endurance";
import Flexibility from "@/components/workoutLog/Flexibility";
import Hiit from "@/components/workoutLog/Hiit";
import Mindbody from "@/components/workoutLog/Mindbody";
import Recovery from "@/components/workoutLog/Recovery";
import Strength from "@/components/workoutLog/Strength";
import { ExerciseCategory } from "@/generated/prisma";
import { getWorkoutDetails, saveWorkoutLog } from "@/lib/db";
import { WorkoutPlanDetailsType } from "@/lib/types";
import { WorkoutLogDataType } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const WorkoutLogPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutPlanDetailsType | null>();
  const [submitting, setSubmitting] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();

  const methods = useForm<WorkoutLogDataType>();
  const {
    formState: { errors },
    register,
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit((data) => {
    if(isLoaded && isSignedIn){
      setSubmitting(true);
      saveWorkoutLog(user.id, workout!.id, data)
        .then(() => {
          router.push('/home')
        })
        .catch(() => {
          setSubmitting(false);
          window.alert("Error submitting workout details")
        })
    }
  });

  useEffect(() => {
    async function getData(id: string) {
      const data = await getWorkoutDetails(id);

      if (data) {
        const initialData: WorkoutLogDataType = {
          notes: "",
          duration: 0,
          strength: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.STRENGTH)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              weightUsed: 0,
              vol: 0,
            })),
          cardio: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.CARDIO)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              caloriesBurned: 0,
              distance: ex.distance || 0,
              duration: ex.time || 0,
              heartRate: 0,
              vo2Max: 0,
              speed: 0,
            })),
          core: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.CORE)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              plankHoldTime: 0,
            })),
          endurance: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.ENDURANCE)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              timeToExhaustion: ex.time || 0,
            })),
          flexibility: data.exercises
            .filter(
              (ex) => ex.exercise.category === ExerciseCategory.FLEXIBILITY
            )
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              rangeOfMotion: 0,
              staticFlexibility: 0,
              dynamicFlexibility: 0,
            })),
          hiit: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.HIIT)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              workIntervalDuration: ex.time || 0,
              workToRestRatio: ex.time && ex.rest > 0 ? ex.time / ex.rest : 0,
            })),
          mindbody: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.MINDBODY)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              duration: ex.time || 0,
            })),
          recovery: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.RECOVERY)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              heartRateVariability: 0,
            })),
          balance: data.exercises
            .filter((ex) => ex.exercise.category === ExerciseCategory.RECOVERY)
            .map((ex) => ({
              exerciseId: ex.exerciseid,
              sets: ex.sets,
              reps: ex.reps,
              rest: ex.rest,
              tug: 0,
            })),
        };
        methods.reset(initialData);
        setWorkout(data);
      }
    }

    if (typeof id === "string") getData(id);
  }, [id, methods]);

  const categoryIndexes = {
    [ExerciseCategory.HIIT]: 0,
    [ExerciseCategory.STRENGTH]: 0,
    [ExerciseCategory.CORE]: 0,
    [ExerciseCategory.BALANCE]: 0,
    [ExerciseCategory.CARDIO]: 0,
    [ExerciseCategory.ENDURANCE]: 0,
    [ExerciseCategory.FLEXIBILITY]: 0,
    [ExerciseCategory.MINDBODY]: 0,
    [ExerciseCategory.RECOVERY]: 0,
  };

  return (
    <div className="py-8 px-60">
      {workout ? (
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <h1 className="text-3xl font-semibold text-zinc-600">
              Log Workout
            </h1>
            <h2 className="text-xl font-semibold text-zinc-600">
              {workout.name}
            </h2>
            <div className="flex justify-between gap-2 w-full">
              <p className="flex flex-col flex-1">
                <label>Notes</label>
                <textarea
                  {...register("notes")}
                  placeholder="You may enter any notes related to this workout here..."
                  className="p-3 outline-none rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border border border-zinc-200"
                />
              </p>
              <p className="flex flex-col">
                <label>Duration (min)</label>
                <input
                  type="number"
                  {...register("duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Duration must be at least 1" },
                    valueAsNumber: true,
                  })}
                  className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border max-w-25"
                />
                {errors.duration && (
                  <span className="error">{errors.duration.message}</span>
                )}
              </p>
            </div>
            {workout.exercises.map((exercise) => {
              const category = exercise.exercise.category;
              const formIndex = categoryIndexes[category];
              categoryIndexes[category]++;

              switch (category) {
                case ExerciseCategory.BALANCE:
                  return (
                    <Balance
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.CARDIO:
                  return (
                    <Cardio
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.CORE:
                  return (
                    <Core
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.ENDURANCE:
                  return (
                    <Endurance
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.FLEXIBILITY:
                  return (
                    <Flexibility
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.HIIT:
                  return (
                    <Hiit
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.MINDBODY:
                  return (
                    <Mindbody
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.RECOVERY:
                  return (
                    <Recovery
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );

                case ExerciseCategory.STRENGTH:
                  return (
                    <Strength
                      key={exercise.id}
                      exerciseName={exercise.exercise.name}
                      formIndex={formIndex}
                    />
                  );
              }
            })}
            <Button
              variant="default"
              className="text-lg font-bold py-5"
              disabled={submitting}
            >
              {submitting ? "Submitting" : "Submit"}
            </Button>
          </form>
        </FormProvider>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WorkoutLogPage;
