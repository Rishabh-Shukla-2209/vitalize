import { GoalType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { Progress } from "../ui/progress";
import { fitnessMetricLabels } from "@/lib/utils";

const Goal = ({ goal }: { goal: GoalType }) => {
  const progress =
    ((goal.currentValue - goal.initialValue) /
      (goal.targetValue - goal.initialValue)) *
    100;

  return (
    <div className="flex gap-2 w-full py-2 bg-zinc-50 rounded-lg my-1">
      <div className="flex-center ml-2.5">
        <Icons.goal className="text-primary rounded-lg" size={45} />
      </div>
      <div className="w-full flex-5 pr-3">
        <h4>{goal.title}</h4>
        <p className="text-zinc-700">
          {goal.targetExercise.name} -{" "}
          {
            fitnessMetricLabels[
              goal.targetField as keyof typeof fitnessMetricLabels
            ]
          }
        </p>
        <p className="flex justify-between">
          <span className="text-sm text-zinc-600">
            Current: {goal.currentValue}
          </span>
          <span className="text-sm text-zinc-600">
            Goal: {goal.targetValue}
          </span>
        </p>
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default Goal;
