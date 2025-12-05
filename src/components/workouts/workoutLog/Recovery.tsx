import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath, Controller } from "react-hook-form";
import { DurationInput } from "@/components/DurationInput";

const Recovery = ({
  formIndex,
  exerciseName,
}: {
  formIndex: number;
  exerciseName: string;
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<WorkoutLogDataType>();

  const setsFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.rest`;
  const heartRateVariabilityFieldName: FieldPath<WorkoutLogDataType> = `recovery.${formIndex}.heartRateVariability`;

  return (
    <div className="mt-5">
      <h3 className="mb-3">{exerciseName}</h3>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] auto-rows items-end gap-5">
        <p>
          <label>Sets</label>
          <input
            type="number"
            {...register(setsFieldName, {
              required: "Sets are required",
              min: { value: 1, message: "Sets must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
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
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
        <div>
          <label>Rest</label>

          <Controller
            name={restFieldName}
            control={control}
            render={({ field }) => (
              <DurationInput
                {...field}
                className="rounded-sm text-zinc-600 bg-zinc-50 focus-within:border-zinc-800 focus-within:border dark:bg-sage-500 dark:text-zinc-200"
              />
            )}
          />
        </div>
        <p>
          <label>Heart Rate Variability</label>
          <input
            type="number"
            {...register(heartRateVariabilityFieldName, {
              required: "HRV is required",
              min: { value: 1, message: "HRV must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
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
