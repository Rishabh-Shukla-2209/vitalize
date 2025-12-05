import { AiWorkoutSchemaType } from "@/validations/ai";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { saveToDB } from "@/lib/actions/ai";
import Icons from "../icons/appIcons";
import AIWorkoutExerciseCard from "./AIWorkoutExerciseCard";
import { handleAppError } from "@/lib/utils";

const AIWorkout = ({
  userId,
  workout,
}: {
  userId: string;
  workout: AiWorkoutSchemaType;
}) => {
  const router = useRouter();

  const addWorkout = async () => {
    try{
      const workoutId = await saveToDB(userId, workout);
      router.push(`/programs/${workoutId}`);
    }catch(err){
      handleAppError(err);
    }
  };

  return (
    <div className="w-full bg-zinc-100 dark:bg-sage-400 p-5 rounded-md">
      <div>
        <div className="flex flex-wrap justify-between mb-2 ">
          <h2 className="my-3">Your Personalised Workout Plan</h2>
          <Button variant="default" onClick={addWorkout} className="text-lg">
            <Icons.add />Add to Workouts
          </Button>
        </div>
        <p>{workout.description}</p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(175px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(225px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(275px,1fr))] auto-rows gap-5 mt-5">
          {workout.exercises.map(ex => (
            <AIWorkoutExerciseCard key={ex.exerciseId} exercise={ex} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIWorkout;
