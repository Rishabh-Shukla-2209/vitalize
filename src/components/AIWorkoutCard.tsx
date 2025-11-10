import Icons from "./icons/appIcons";
import { Button } from "./ui/button";
import Link from "next/link";

const AIWorkoutCard = ({
  workout,
}: {
  workout: { name: string; id: string, createdAt: Date };
}) => {
  return (
    <div>
      <div className="flex justify-between p-5 bg-zinc-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex-center bg-zinc-100 h-15 w-15 rounded-lg">
            <Icons.ai className="text-primary" size={40} />
          </div>
          <div>
            <h3 className="text-zinc-700 font-semibold text-lg">
              {workout.name.length <= 30
                ? workout.name
                : `${workout.name.slice(0, 30)}...`}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/programs/${workout.id}`}>
            <Button variant="outline">
              <Icons.view />
              View
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}`}>
            <Button variant="outline">
              <Icons.repeat />
              Repeat
            </Button>
          </Link>
          <Link href={`/workouts/log-workout/${workout.id}`}>
            <Button variant="outline">
              <Icons.log />
              Log Workout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutCard;
