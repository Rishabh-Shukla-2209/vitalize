import { ExerciseLogType } from "@/lib/types";
import {
  fitnessMetricLabels,
  fitnessMetricUnits,
  formatDistance,
  formatDuration,
} from "@/lib/utils";

const ExerciseLog = ({
  exercise,
  name,
}: {
  exercise: ExerciseLogType;
  name: string | null;
}) => {
  return (
    <div className="flex gap-2">
      <p className="flex-1 font-semibold">{name}</p>
      <ul className="flex gap-3 flex-wrap gap-y-0.5 text-zinc-600 dark:text-zinc-100 flex-5">
        {Object.entries(fitnessMetricUnits).map(([key, unit]) => {
          const value = exercise[key as keyof typeof fitnessMetricUnits];

          const label =
            fitnessMetricLabels[key as keyof typeof fitnessMetricLabels];

          if (
            (typeof value === "number" && value > 0) ||
            (typeof value === "string" && value !== "")
          ) {
            return (
              <li key={key}>
                {label}:{" "}
                {key === "time" ||
                key === "duration" ||
                key === "tug" ||
                key === "plankHoldTime" ||
                key === "workIntervalDuration" ||
                key === "timeToExhaustion" ||
                key === "restIntervalDuration" || 
                key === "rest"
                  ? formatDuration(value as number)
                  : key === "distance"
                  ? formatDistance(value as number)
                  : value}{" "}
                {unit}
              </li>
            );
          }

          return null;
        })}
      </ul>
    </div>
  );
};

export default ExerciseLog;
