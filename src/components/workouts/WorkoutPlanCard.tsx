import { WorkoutPlanType } from "@/lib/types";
import Image from "next/image";
import Icons from "../icons/appIcons";
import clsx from "clsx";

const WorkoutPlanCard = ({ workout }: { workout: WorkoutPlanType }) => {
  return (
    <div className="h-full flex flex-col gap-3 p-4 rounded-lg bg-zinc-100 dark:bg-sage-400 cursor-pointer">
      <div className="relative w-full h-55 rounded-xl overflow-hidden">
        <Image
          src={workout.imgUrl ? workout.imgUrl : "/workoutPlanImg.png"}
          alt="Workout image"
          fill
          style={{ objectFit: "cover" }}
        />
        <div
          className={clsx(
            "absolute border z-1 text-sm text-white font-bold py-1 px-1.5 rounded-r-full rounded-l-full top-2 right-2",
            { "bg-red-600": workout.level === "ADVANCED" },
            { "bg-amber-400": workout.level === "INTERMEDIATE" },
            { "bg-green-500": workout.level === "BEGINNER" }
          )}
        >
          {workout?.level}
        </div>
      </div>
      <h3>{workout.name}</h3>
      <p>{workout.description}</p>
      <p className="flex gap-1">
        <span className="text-sm">
          <Icons.clock />
        </span>{" "}
        <span>{workout.duration} min</span>
      </p>
    </div>
  );
};

export default WorkoutPlanCard;
