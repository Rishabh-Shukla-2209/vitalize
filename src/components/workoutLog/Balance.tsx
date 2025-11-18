import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Balance = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.rest`;
  const tugFieldName: FieldPath<WorkoutLogDataType> = `balance.${formIndex}.tug`;

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
          <label>TUG</label>
          <input
            type="number"
            {...register(tugFieldName, {
              required: "TUG is required",
              min: { value: 1, message: "TUG must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.balance && errors.balance[formIndex]?.tug && (
            <span className="error">
              {errors.balance[formIndex].tug.message}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Balance;
