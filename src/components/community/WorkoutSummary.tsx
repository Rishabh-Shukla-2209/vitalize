import ExerciseLog from "../ExerciseLog";
import { WorkoutLogType } from "@/lib/types";

const WorkoutSummary = ({ workout }: { workout: Omit<WorkoutLogType, "plan"> }) => {
  return (
    <div className="bg-zinc-200 py-2 px-3 rounded">
      <h2 className="text-zinc-700 font-semibold text-lg mb-1">Workout Summary</h2>
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
