import { DurationInput } from "@/components/DurationInput";
import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath, Controller } from "react-hook-form";

const Balance = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.rest`;
  const tugFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.tug`;

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
          {errors.balance && errors.balance[formIndex]?.sets && (
            <span className="error">
              {errors.balance[formIndex].sets.message}
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
        <div>
          <label>TUG</label>
          <Controller
            name={tugFieldName}
            control={control}
            rules={{
              required: "TUG is required",
              min: { value: 1, message: "TUG must be at least 1" },
            }}
            render={({ field }) => (
              <DurationInput
                {...field}
                className="rounded-sm text-zinc-600 bg-zinc-50 focus-within:border-zinc-800 focus-within:border dark:bg-sage-500 dark:text-zinc-200"
              />
            )}
          />

          {errors.balance && errors.balance[formIndex]?.tug && (
            <span className="error">
              {errors.balance[formIndex].tug.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;
