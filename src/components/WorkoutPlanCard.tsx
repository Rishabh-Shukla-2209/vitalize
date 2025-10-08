import { WorkoutPlanType } from "@/lib/types";
import Image from "next/image";
import Icons from "./icons/appIcons";
import clsx from "clsx";
import Link from "next/link";

const WorkoutPlanCard = ({ workout }: { workout: WorkoutPlanType }) => {
  return (
    <Link href={`/programs/${workout.id}`}>
      <div className="h-full flex flex-col gap-3 p-4 rounded-lg bg-zinc-100 cursor-pointer">
        <div className="relative w-full h-55 rounded-xl overflow-hidden">
          <Image
            src={workout.imgUrl ? workout.imgUrl : "/workoutPlanImg.png"}
            alt="Workout image"
            fill
            style={{objectFit: "cover"}}
          />
          <div
            className={clsx("absolute border z-1 text-sm text-white font-bold py-1 px-1.5 rounded-r-full rounded-l-full top-2 right-2",
              {"bg-red-600": workout.level === "ADVANCED"},
              {"bg-amber-400": workout.level === "INTERMEDIATE"},
              {"bg-green-500": workout.level === "BEGINNER"},
            )}
          >
            {workout?.level}
          </div>
        </div>
        <h3 className="text-zinc-800 font-semibold text-lg">{workout.name}</h3>
        <p className="text-zinc-600">{workout.description}</p>
        <p className="flex gap-1 text-zinc-700">
          <span className="text-sm">
            <Icons.clock />
          </span>{" "}
          <span>{workout.duration} min</span>
        </p>
      </div>
    </Link>
  );
};

export default WorkoutPlanCard;
