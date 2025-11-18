import { AiWorkoutSchemaType } from "@/validations/ai";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { saveToDB } from "@/lib/actions/ai";
import Icons from "../icons/appIcons";
import AIWorkoutExerciseCard from "./AIWorkoutExerciseCard";

const AIWorkout = ({
  userId,
  workout,
}: {
  userId: string;
  workout: AiWorkoutSchemaType;
}) => {
  const router = useRouter();

  const addWorkout = async () => {
    const workoutId = await saveToDB(userId, workout);
    router.push(`/programs/${workoutId}`);
  };

  return (
    <div className="w-full bg-zinc-100 p-5 rounded-md">
      <div>
        <div className="flex justify-between mb-2">
          <h2 className="my-3">Your Personalised Workout Plan</h2>
          <Button variant="default" onClick={addWorkout} className="text-lg">
            <Icons.add />Add to Workouts
          </Button>
        </div>
        <p>{workout.description}</p>
        <div className="grid grid-cols-3 auto-rows gap-5 mt-5">
          {workout.exercises.map(ex => (
            <AIWorkoutExerciseCard key={ex.exerciseId} exercise={ex} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIWorkout;
