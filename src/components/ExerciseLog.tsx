import { ExerciseLogType } from "@/lib/types";
import { fitnessMetricLabels, fitnessMetricUnits } from "@/lib/utils";

const ExerciseLog = ({ exercise, name }: { exercise: ExerciseLogType, name: string | null}) => {
  return (
    <div>
      <h3 className="text-zinc-600 font-semibold">{name}</h3>
      <ul className="flex gap-3 text-zinc-600">
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
               • {label}: {value} {unit} 
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
