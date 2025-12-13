import { addGoal, getAllExercises } from "@/lib/actions/goal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useForm, Controller, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Combobox from "@/components/Combobox";
import Selector from "../Selector";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { handleAppError, validCategoryFields } from "@/lib/utils";
import { DurationInput } from "@/components/DurationInput";
import { DistanceInput } from "@/components/DistanceInput";
import { GoalFormValues, goalSchema } from "@/validations/goal";
import { Spinner } from "../ui/spinner";

type ValueFieldProps = ControllerRenderProps<
  GoalFormValues,
  "currentValue" | "targetValue"
>;

const AddGoal = ({
  userId,
  setAddGoal,
  resetSearch,
}: {
  userId: string;
  setAddGoal: Dispatch<SetStateAction<boolean>>;
  resetSearch: () => void;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      field: "",
      currentValue: undefined,
      targetValue: undefined,
    },
  });

  const { data: exercises } = useQuery({
    queryKey: ["Exercises"],
    queryFn: getAllExercises,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const selectedExercise = watch("exercise");
  const selectedField = watch("field");

  useEffect(() => {
    setValue("field", "");
  }, [selectedExercise?.id, setValue]);

  const renderValueInput = (field: ValueFieldProps) => {
    if (
      selectedField === "time" ||
      selectedField === "duration" ||
      selectedField === "tug" ||
      selectedField === "plankHoldTime" ||
      selectedField === "workIntervalDuration" ||
      selectedField === "timeToExhaustion"
    ) {
      return (
        <DurationInput
          value={field.value}
          onChange={field.onChange}
          className="bg-white dark:bg-sage-400 rounded-md"
        />
      );
    }
    if (selectedField === "distance") {
      return (
        <DistanceInput
          value={field.value}
          onChange={field.onChange}
          className="bg-white dark:bg-sage-400 rounded-md"
        />
      );
    }
    return (
      <input
        type="number"
        placeholder="Value"
        className="text-sm w-full py-2 px-3 rounded-md border dark:bg-sage-400 focus:border-zinc-400 focus:outline-none"
        value={field.value ?? ""}
        onChange={(e) => {
          const val = e.target.valueAsNumber;
          field.onChange(isNaN(val) ? undefined : val);
        }}
      />
    );
  };

  const onSubmit = async (values: GoalFormValues) => {
    const data = {
      userid: userId,
      title: values.title,
      targetExerciseid: values.exercise!.id,
      targetField: values.field,
      currentValue: values.currentValue!,
      targetValue: values.targetValue!,
      initialValue: values.currentValue!,
      targetDate: values.targetDate!,
    };

    try {
      await addGoal(data);
      resetSearch();
      queryClient.invalidateQueries({
        queryKey: ["activeGoals"],
      });
      setAddGoal(false);
    } catch (err) {
      handleAppError(err);
    }
  };

  return (
    <div className="border p-5 rounded-md bg-zinc-100 dark:bg-sage-500">
      <h3 className="mb-1.5">Goal Details</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2 justify-between">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col md:flex-row md:justify-between gap-5">
              <div className="flex flex-col gap-1 w-full">
                <input
                  {...register("title")}
                  placeholder="Enter Goal title"
                  className="text-sm py-2 px-3 rounded-md border dark:bg-sage-400 focus:border-zinc-400 focus:outline-none"
                />
                {errors.title && (
                  <span className="error">{errors.title.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full items-start md:items-center">
                <Controller
                  name="exercise"
                  control={control}
                  render={({ field }) =>
                    exercises ? (
                      <Combobox
                        choices={exercises}
                        setChoice={(val) => field.onChange(val)}
                      />
                    ) : (
                      <Spinner />
                    )
                  }
                />
                {errors.exercise && (
                  <span className="error">{errors.exercise.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                {selectedExercise && (
                  <Controller
                    name="field"
                    control={control}
                    render={({ field }) => (
                      <Selector
                        choices={validCategoryFields[selectedExercise.category]}
                        selectedValue={field.value}
                        placeholder="Select Parameter"
                        setChoice={(val) => field.onChange(val)}
                        classes="bg-white hover:bg-zinc-100 dark:bg-sage-400 dark:hover:bg-sage-400"
                      />
                    )}
                  />
                )}
                {errors.field && (
                  <span className="error">{errors.field.message}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap gap-5">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-muted-foreground">
                  Current Value
                </label>
                <Controller
                  name="currentValue"
                  control={control}
                  render={({ field }) => renderValueInput(field)}
                />
                {errors.currentValue && (
                  <span className="error">{errors.currentValue.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-muted-foreground">
                  Target Value
                </label>
                <Controller
                  name="targetValue"
                  control={control}
                  render={({ field }) => renderValueInput(field)}
                />
                {errors.targetValue && (
                  <span className="error">{errors.targetValue.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs text-muted-foreground">
                  Target Date
                </label>
                <Controller
                  name="targetDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label=""
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                    />
                  )}
                />
                {errors.targetDate && (
                  <span className="error">{errors.targetDate.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-5 items-center w-full">
            <Button
              variant="default"
              className="w-full"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? <Spinner /> : "Add"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
              type="button"
              onClick={() => setAddGoal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddGoal;
