import Icons from "../icons/appIcons";
import { Button } from "../ui/button";
import Link from "next/link";

const AIWorkoutCard = ({
  workout,
}: {
  workout: { name: string; id: string; createdAt: Date };
}) => {
  return (
    <div>
      <div className="flex gap-2 justify-between p-5 bg-zinc-50 dark:bg-sage-400 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex-center bg-zinc-100 dark:bg-sage-500 h-15 w-15 rounded-lg">
            <Icons.ai className="text-primary" size={40} />
          </div>
          <div>
            <p className="font-semibold">
              {workout.name.length <= 30
                ? workout.name
                : `${workout.name.slice(0, 30)}...`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/programs/${workout.id}`}>
            <Button variant="outline">
              <Icons.view />
              <span className="hidden md:inline">View</span>
            </Button>
          </Link>
          <Link href={`/workouts/${workout.id}`}>
            <Button variant="outline">
              <Icons.repeat />
              <span className="hidden md:inline">Repeat</span>
            </Button>
          </Link>
          <Link href={`/workouts/log-workout/${workout.id}`}>
            <Button variant="outline">
              <Icons.log />
              <span className="hidden md:inline">Log Workout</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutCard;
