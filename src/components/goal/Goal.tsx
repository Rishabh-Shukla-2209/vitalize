import { GoalType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { Progress } from "../ui/progress";
import { fitnessMetricLabels, formatDistance, formatDuration } from "@/lib/utils";

const Goal = ({ goal }: { goal: GoalType }) => {
  const progress =
    ((goal.currentValue - goal.initialValue) /
      (goal.targetValue - goal.initialValue)) *
    100;

  return (
    <div className="flex gap-2 w-full py-2 bg-zinc-50 dark:bg-sage-400 rounded-lg my-1">
      <div className="flex-center ml-2.5">
        <Icons.goal className="text-primary rounded-lg" size={45} />
      </div>
      <div className="w-full flex-5 pr-3">
        <h4>{goal.title}</h4>
        <p>
          {goal.targetExercise.name} -{" "}
          {
            fitnessMetricLabels[
              goal.targetField as keyof typeof fitnessMetricLabels
            ]
          }
        </p>
        <p className="flex justify-between">
          <span className="text-sm text-zinc-600 dark:text-zinc-200">
            Current:{" "}
            {goal.targetField === "time" ||
            goal.targetField === "duration" ||
            goal.targetField === "tug" ||
            goal.targetField === "plankHoldTime" ||
            goal.targetField === "workIntervalDuration" ||
            goal.targetField === "timeToExhaustion"
              ? formatDuration(goal.currentValue)
              : goal.targetField === "distance" ? formatDistance(goal.currentValue) : goal.currentValue}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-200">
            Goal:{" "}
            {goal.targetField === "time" ||
            goal.targetField === "duration" ||
            goal.targetField === "tug" ||
            goal.targetField === "plankHoldTime" ||
            goal.targetField === "workIntervalDuration" ||
            goal.targetField === "timeToExhaustion"
              ? formatDuration(goal.targetValue)
              : goal.targetField === "distance" ? formatDistance(goal.targetValue) : goal.targetValue}
          </span>
        </p>
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default Goal;
