import { WorkoutLogDataType } from "@/lib/types";
import { useEffect } from "react";
import { useFormContext, FieldPath } from "react-hook-form";

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
    setValue,
    formState: { errors },
  } = useFormContext<WorkoutLogDataType>();

  const setsFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.rest`;
  const workIntervalDurationFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.workIntervalDuration`;
  const workToRestFieldName: FieldPath<WorkoutLogDataType> = `hiit.${formIndex}.workToRestRatio`;

  const [work, rest] = watch([workIntervalDurationFieldName, restFieldName]);

  useEffect(() => {
    const WRRatio = Math.round(((work || 0) / (rest || 1)) * 100) / 100;
    setValue(workToRestFieldName, WRRatio);
  }, [rest, setValue, work, workToRestFieldName]);

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
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
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
          <label>Set Duration</label>
          <input
            type="number"
            {...register(workIntervalDurationFieldName, {
              required: "Duration is required",
              min: { value: 1, message: "Duration must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.hiit && errors.hiit[formIndex]?.workIntervalDuration && (
            <span className="error">
              {errors.hiit[formIndex].workIntervalDuration.message}
            </span>
          )}
        </p>
        <p>
          <label>Work-Rest Ratio</label>
          <input
            type="number"
            {...register(workToRestFieldName, { valueAsNumber: true })}
            readOnly
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
      </div>
    </div>
  );
};

export default Hiit;
