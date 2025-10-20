import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Core = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `core.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `core.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `core.${formIndex}.rest`;
  const plankHoldTimeFieldName: FieldPath<WorkoutLogDataType> = `core.${formIndex}.plankHoldTime`;

  return (
    <div className="mt-5">
      <h3 className="text-zinc-700 font-semibold text-lg mb-3">
        {exerciseName}
      </h3>
      <div className="flex gap-5 flex-wrap text-zinc-600">
        <p className="flex flex-col">
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
          {errors.core && errors.core[formIndex]?.sets && (
            <span className="error">{errors.core[formIndex].sets.message}</span>
          )}
        </p>
        <p className="flex flex-col">
          <label>Reps</label>
          <input
            type="number"
            {...register(repsFieldName, {
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Rest (s)</label>
          <input
            type="number"
            {...register(restFieldName, {
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Plank Hold Time</label>
          <input
            type="number"
            {...register(plankHoldTimeFieldName, {
              required: "PHT is required",
              min: { value: 1, message: "PHT must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.core && errors.core[formIndex]?.plankHoldTime && (
            <span className="error">
              {errors.core[formIndex].plankHoldTime.message}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Core;
