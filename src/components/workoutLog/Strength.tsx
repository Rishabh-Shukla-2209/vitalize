import { WorkoutLogDataType } from "@/lib/types";
import { useEffect } from "react";
import { useFormContext, FieldPath } from "react-hook-form";

const Strength = ({
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
          {errors.strength && errors.strength[formIndex]?.sets && (
            <span className="error">
              {errors.strength[formIndex].sets.message}
            </span>
          )}
        </p>
        <p className="flex flex-col">
          <label>Reps</label>
          <input
            type="number"
            {...register(repsFieldName, {
              required: "Reps are required",
              min: { value: 1, message: "Reps must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.strength && errors.strength[formIndex]?.reps && (
            <span className="error">
              {errors.strength[formIndex].reps.message}
            </span>
          )}
        </p>
        <p className="flex flex-col">
          <label>Rest (s)</label>
          <input
            type="number"
            {...register(restFieldName, {
              required: "Rest is required",
              min: { value: 1, message: "Rest must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.strength && errors.strength[formIndex]?.rest && (
            <span className="error">
              {errors.strength[formIndex].rest.message}
            </span>
          )}
        </p>
        <p className="flex flex-col">
          <label>Weight Used</label>
          <input
            type="number"
            {...register(weightUsedFieldName, { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Volume</label>
          <input
            type="number"
            {...(register(volFieldName), { valueAsNumber: true })}
            readOnly
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
      </div>
    </div>
  );
};

export default Strength;
