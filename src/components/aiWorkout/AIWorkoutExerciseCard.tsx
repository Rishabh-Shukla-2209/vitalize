import Icons from "../icons/appIcons";

type Props = {
  position: number;
  name: string;
  benefit: string;
  sets: number;
  reps: number;
  rest: number;
  exerciseId: string;
  distance?: number | undefined;
  time?: number | undefined;
};

const AIWorkoutExerciseCard = ({ exercise }: { exercise: Props }) => {
  return (
    <div className="bg-zinc-200 rounded-md p-3">
      <div className="flex mb-2">
        <div className="flex-1">
          <Icons.dumbell size={60} className="bg-zinc-100 text-primary-dark p-2 rounded-md" />
        </div>
        <div className="flex-3">
          <p className="font-semibold text-zinc-700">{exercise.name}</p>
          <p className="text-zinc-700">
            {exercise.sets} sets of{" "}
            {exercise.time
              ? `${exercise.time} s`
              : exercise.distance
              ? `${exercise.distance} m`
              : `${exercise.reps} reps`}{" "}
            with {exercise.rest}s rest
          </p>
        </div>
      </div>
      <p className="text-zinc-600 text-justify">{exercise.benefit}</p>
    </div>
  );
};

export default AIWorkoutExerciseCard;
