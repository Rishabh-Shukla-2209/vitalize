import { WorkoutLogDataType } from "@/lib/types";
import { useEffect } from "react";
import { useFormContext, FieldPath, Controller } from "react-hook-form";
import { DurationInput } from "@/components/DurationInput";

const Strength = ({
  formIndex,
  exerciseName,
}: {
  formIndex: number;
  exerciseName: string;
}) => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<WorkoutLogDataType>();

  const setsFieldName: FieldPath<WorkoutLogDataType> = `strength.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `strength.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `strength.${formIndex}.rest`;
  const weightUsedFieldName: FieldPath<WorkoutLogDataType> = `strength.${formIndex}.weightUsed`;
  const volFieldName: FieldPath<WorkoutLogDataType> = `strength.${formIndex}.vol`;

  const [sets, reps, weight] = watch([
    setsFieldName,
    repsFieldName,
    weightUsedFieldName,
  ]);

  useEffect(() => {
    const newVol = (sets || 0) * (reps || 0) * (weight || 0);
    setValue(volFieldName, newVol);
  }, [sets, reps, setValue, volFieldName, weight]);

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
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 dark:bg-sage-500 dark:text-zinc-200 focus:border-zinc-800 focus:border"
          />
          {errors.strength && errors.strength[formIndex]?.sets && (
            <span className="error">
              {errors.strength[formIndex].sets.message}
            </span>
          )}
        </p>
        <p>
          <label>Reps</label>
          <input
            type="number"
            {...register(repsFieldName, {
              required: "Reps are required",
              min: { value: 1, message: "Reps must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
          {errors.strength && errors.strength[formIndex]?.reps && (
            <span className="error">
              {errors.strength[formIndex].reps.message}
            </span>
          )}
        </p>
        <div>
          <label>Rest</label>

          <Controller
            name={restFieldName}
            control={control}
            rules={{
              required: "Rest is required",
              min: { value: 1, message: "Rest must be at least 1" },
            }}
            render={({ field }) => (
              <DurationInput
                {...field}
                className="rounded-sm text-zinc-600 bg-zinc-50 focus-within:border-zinc-800 focus-within:border dark:bg-sage-500 dark:text-zinc-200"
              />
            )}
          />

          {errors.strength && errors.strength[formIndex]?.rest && (
            <span className="error">
              {errors.strength[formIndex].rest.message}
            </span>
          )}
        </div>
        <p>
          <label>Weight Used</label>
          <input
            type="number"
            {...register(weightUsedFieldName, { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
        <p>
          <label>Volume</label>
          <input
            type="number"
            {...register(volFieldName, { valueAsNumber: true })}
            readOnly
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
      </div>
    </div>
  );
};

export default Strength;
