import { WorkoutLogDataType } from "@/lib/types";
import { useFormContext, FieldPath } from "react-hook-form";

const Cardio = ({
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

  const setsFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.sets`;
  const repsFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.reps`;
  const restFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.rest`;
  const caloriesBurnedFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.caloriesBurned`;
  const distanceFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.distance`;
  const durationFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.duration`;
  const heartRateFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.heartRate`;
  const vo2MaxFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.vo2Max`;
  const speedFieldName: FieldPath<WorkoutLogDataType> = `cardio.${formIndex}.speed`;

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
          {errors.cardio && errors.cardio[formIndex]?.sets && (
            <span className="error">
              {errors.cardio[formIndex].sets.message}
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
          <label>Calories Burned</label>
          <input
            type="number"
            {...register(caloriesBurnedFieldName, {
              required: "Calories are required",
              min: { value: 1, message: "Calories must be at least 1" },
              valueAsNumber: true,
            })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
          {errors.cardio && errors.cardio[formIndex]?.caloriesBurned && (
            <span className="error">
              {errors.cardio[formIndex].caloriesBurned.message}
            </span>
          )}
        </p>
        <p className="flex flex-col">
          <label>Distance</label>
          <input
            type="number"
            {...(register(distanceFieldName), { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Duration</label>
          <input
            type="number"
            {...(register(durationFieldName), { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Heart Rate</label>
          <input
            type="number"
            {...(register(heartRateFieldName), { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>VO2 Max</label>
          <input
            type="number"
            {...(register(vo2MaxFieldName), { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
        <p className="flex flex-col">
          <label>Speed</label>
          <input
            type="number"
            {...(register(speedFieldName), { valueAsNumber: true })}
            className="input-no-spinner rounded-sm text-zinc-600 bg-zinc-50 focus:border-zinc-800 focus:border"
          />
        </p>
      </div>
    </div>
  );
};

export default Cardio;
