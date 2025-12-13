import ExerciseLog from "../workouts/ExerciseLog";
import { WorkoutLogType } from "@/lib/types";

const WorkoutSummary = ({
  workout,
}: {
  workout: Omit<WorkoutLogType, "plan">;
}) => {
  return (
    <div className="bg-zinc-200 dark:bg-sage-500 py-2 px-3 rounded">
      <h3 className="mb-1">Workout Summary</h3>
      <div className="flex flex-col gap-2">
        {workout.exercises.map((exercise) => (
          <ExerciseLog
            key={exercise.id}
            exercise={exercise}
            name={exercise.exercise.name}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutSummary;
