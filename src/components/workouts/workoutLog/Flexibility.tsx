import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath, Controller } from "react-hook-form";
import { DurationInput } from "@/components/DurationInput";

const Flexibility = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.rest`;
  const rangeOfMotionFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.rangeOfMotion`;
  const staticFlexibilityFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.staticFlexibility`;
  const dynamicFlexibilityFieldName: FieldPath<WorkoutLogDataType> = `flexibility.${formIndex}.dynamicFlexibility`;

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
          {errors.flexibility && errors.flexibility[formIndex]?.sets && (
            <span className="error">
              {errors.flexibility[formIndex].sets.message}
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
          <label>Range of Motion</label>
          <input
            type="number"
            {...register(rangeOfMotionFieldName, {
              required: "ROM is required",
              min: { value: 1, message: "ROM must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
          {errors.flexibility &&
            errors.flexibility[formIndex]?.rangeOfMotion && (
              <span className="error">
                {errors.flexibility[formIndex].rangeOfMotion.message}
              </span>
            )}
        </p>
        <p>
          <label>Static Flexibility</label>
          <input
            type="number"
            {...register(staticFlexibilityFieldName, { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
        <p>
          <label>Dynamic Flexibility</label>
          <input
            type="number"
            {...register(dynamicFlexibilityFieldName, { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border dark:bg-sage-500 dark:text-zinc-200"
          />
        </p>
      </div>
    </div>
  );
};

export default Flexibility;
