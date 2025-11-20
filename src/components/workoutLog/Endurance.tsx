import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Endurance = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `endurance.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `endurance.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `endurance.${formIndex}.rest`;
  const timeToExhaustionFieldName: FieldPath<WorkoutLogDataType> = `endurance.${formIndex}.timeToExhaustion`;

  return (
    <div className="mt-5">
      <h3 className="text-zinc-700 font-semibold text-lg mb-3">
        {exerciseName}
      </h3>
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
          {errors.endurance && errors.endurance[formIndex]?.sets && (
            <span className="error">
              {errors.endurance[formIndex].sets.message}
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
          <label>Time to Exhaustion</label>
          <input
            type="number"
            {...register(timeToExhaustionFieldName, {
              required: "TTE is required",
              min: { value: 1, message: "TTE must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.endurance &&
            errors.endurance[formIndex]?.timeToExhaustion && (
              <span className="error">
                {errors.endurance[formIndex].timeToExhaustion.message}
              </span>
            )}
        </p>
      </div>
    </div>
  );
};

export default Endurance;
