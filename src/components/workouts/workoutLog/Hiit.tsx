import { WorkoutLogDataType } from "@/lib/types";
import { useEffect } from "react";
import { useFormContext, FieldPath, Controller } from "react-hook-form";
import { DurationInput } from "@/components/DurationInput";

const Hiit = ({
  formIndex,
  exerciseName,
}: {
  formIndex: number;
  exerciseName: string;
}) => {
  const {
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<WorkoutLogDataType>();

  const setsFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.rest`;
  const workIntervalDurationFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.workIntervalDuration`;
  const workToRestFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.workToRestRatio`;

  const [work, rest] = watch([workIntervalDurationFieldName, restFieldName]);

  const workVal = parseFloat(work as unknown as string) || 0;
  const restVal = parseFloat(rest as unknown as string) || 1;

  const WRRatio = Math.round((workVal / restVal) * 100) / 100;

  useEffect(() => {
    setValue(workToRestFieldName, WRRatio);
  }, [WRRatio, setValue, workToRestFieldName]);

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
          {errors.hiit && errors.hiit[formIndex]?.sets && (
            <span className="error">{errors.hiit[formIndex].sets.message}</span>
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
          <label>Set Duration</label>
          <Controller
            name={workIntervalDurationFieldName}
            control={control}
            rules={{
              required: "Duration is required",
              min: { value: 1, message: "Duration must be at least 1" },
            }}
            render={({ field }) => (
              <DurationInput
                {...field}
                className="rounded-sm text-zinc-600 bg-zinc-50 focus-within:border-zinc-800 focus-within:border dark:bg-sage-500 dark:text-zinc-200"
              />
            )}
          />

          {errors.hiit && errors.hiit[formIndex]?.workIntervalDuration && (
            <span className="error">
              {errors.hiit[formIndex].workIntervalDuration.message}
            </span>
          )}
        </div>
        <p>
          <label>Work-Rest Ratio</label>
          <input
            type="number"
            {...register(workToRestFieldName, { valueAsNumber: true })}
            readOnly
            value={isNaN(WRRatio) ? "" : WRRatio}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
      </div>
    </div>
  );
};

export default Hiit;
