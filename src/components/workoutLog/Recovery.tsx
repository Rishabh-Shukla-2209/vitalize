import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Recovery = ({
  formIndex,
  exerciseName,
}: {
  formIndex: number;
  exerciseName: string;
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<WorkoutLogDataType>();

  const setsFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.rest`;
  const heartRateVariabilityFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.heartRateVariability`;

  return (
    <div className="mt-5">
      <h3 className="mb-3">
        {exerciseName}
      </h3>
      <div className="flex gap-5 flex-wrap text-zinc-600">
        <p>
          <label>Sets</label>
          <input
            type="number"
            {...register(setsFieldName, {
              required: "Sets are required",
              min: { value: 1, message: "Sets must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.recovery && errors.recovery[formIndex]?.sets && (
            <span className="error">
              {errors.recovery[formIndex].sets.message}
            </span>
          )}
        </p>
        <p>
          <label>Reps</label>
          <input
            type="number"
            {...register(repsFieldName, {
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p>
          <label>Rest (s)</label>
          <input
            type="number"
            {...register(restFieldName, {
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p>
          <label>Heart Rate Variability</label>
          <input
            type="number"
            {...register(heartRateVariabilityFieldName, {
              required: "HRV is required",
              min: { value: 1, message: "HRV must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.recovery &&
            errors.recovery[formIndex]?.heartRateVariability && (
              <span className="error">
                {errors.recovery[formIndex].heartRateVariability.message}
              </span>
            )}
        </p>
      </div>
    </div>
  );
};

export default Recovery;
