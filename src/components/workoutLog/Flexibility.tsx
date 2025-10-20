import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Flexibility = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.rest`;
  const rangeOfMotionFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.rangeOfMotion`;
  const staticFlexibilityFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.staticFlexibility`;
  const dynamicFlexibilityFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.dynamicFlexibility`;

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
          {errors.flexibility && errors.flexibility[formIndex]?.sets && (
            <span className="error">
              {errors.flexibility[formIndex].sets.message}
            </span>
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
          <label>Range of Motion</label>
          <input
            type="number"
            {...register(rangeOfMotionFieldName, {
              required: "ROM is required",
              min: { value: 1, message: "ROM must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.flexibility &&
            errors.flexibility[formIndex]?.rangeOfMotion && (
              <span className="error">
                {errors.flexibility[formIndex].rangeOfMotion.message}
              </span>
            )}
        </p>
        <p className="flex flex-col">
          <label>Static Flexibility</label>
          <input
            type="number"
            {...register(staticFlexibilityFieldName)}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Dynamic Flexibility</label>
          <input
            type="number"
            {...register(dynamicFlexibilityFieldName)}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
      </div>
    </div>
  );
};

export default Flexibility;
