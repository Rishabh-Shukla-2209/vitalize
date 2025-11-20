import { addGoal, getAllExercises } from "@/lib/queries";
import { ExerciseCategoryType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Combobox from "@/components/Combobox";
import Selector from "../Selector";
import { validCategoryFields } from "@/lib/utils";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { isBefore } from "date-fns";

const AddGoal = ({ userId, setAddGoal, resetSearch }: { userId: string, setAddGoal: Dispatch<SetStateAction<boolean>>, resetSearch: () => void }) => {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [exercise, setExercise] = useState<{
    id: string;
    name: string;
    category: ExerciseCategoryType;
  }>();
  const [exError, setExError] = useState("");
  const [field, setField] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [currentValue, setCurrValue] = useState("");
  const [currValError, setCurrValError] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetValError, setTargetValError] = useState("");
  const [targetDate, setTargetDate] = useState<Date>();
  const [dateError, setDateError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data } = useQuery({
    queryKey: ["Exercises"],
    queryFn: getAllExercises,
    staleTime: Infinity,
  });

  useEffect(() => {
      if (!submitAttempted) return;
  
      const validTitle = /^[A-Za-z0-9 _-]+$/;
      if (!title) {
        setTitleError("Required");
        return;
      }
      if (title && !validTitle.test(title)) {
        setTitleError("Invalid title. Title should only contain letters and numbers.");
        return;
      }
  
      setTitleError("");
    }, [title, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validValues = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    if (!currentValue) {
      setCurrValError("Required");
      return;
    }

    if (
      !validValues.test(currentValue)
    ) {
      setCurrValError("Enter a valid value.");
      return;
    }

    setCurrValError("");
  }, [submitAttempted, currentValue]);

  useEffect(() => {
    if (!submitAttempted) return;

    const validValues = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    if (!targetValue) {
      setTargetValError("Required");
      return;
    }

    if (
      !validValues.test(targetValue)
    ) {
      setTargetValError("Enter a valid value.");
      return;
    }

    setTargetValError("");
  }, [submitAttempted, targetValue]);

  useEffect(() => {
    if (!submitAttempted) return;

    if (!targetDate) {
      setDateError("Required");
      return;
    }

    if(isBefore(targetDate, new Date())){
        setDateError("Date can't be past or today.");
        return;
    }
    setDateError("");
  }, [targetDate, submitAttempted]);

  useEffect(() => {
    if (!submitAttempted) return;

    if (!exercise) {
      setExError("Required");
      return;
    }

    setExError("");
  }, [exercise, submitAttempted]);
  
  useEffect(() => {
    if (!submitAttempted || !exercise) return;

    if (!field) {
      setFieldError("Required");
      return;
    }

    setFieldError("");
  }, [exercise, field, submitAttempted]);

  const areInputsValid = () => {
    let isValid = true;
    const validTitle = /^[A-Za-z0-9 _-]+$/;
    const validValues = /^(?:[1-9]\d*|0)?(?:\.\d+)?$/;

    // --- Validate Title ---
    if (!title) {
        setTitleError("Required");
        isValid = false;
      }else if (title && !validTitle.test(title)) {
        setTitleError("Only letters and numbers.");
        isValid = false;
      }else setTitleError("");

    // --- Validate current value ---
    if (!currentValue) {
      setCurrValError("Required");
      isValid = false;
    }else if (
      !validValues.test(currentValue)
    ) {
      setCurrValError("Enter a valid value.");
      isValid = false;
    }else setCurrValError("");

    // --- Validate Target Value ---
    if (!targetValue) {
      setTargetValError("Required");
      isValid = false;
    }else if (
      !validValues.test(targetValue)
    ) {
      setTargetValError("Enter a valid value.");
      isValid = false;
    }else setTargetValError("");

    // --- Validate Date ---
    if (!targetDate) {
      setDateError("Required");
      isValid = false;
    }else if(isBefore(targetDate, new Date())){
        setDateError("Date can't be past or today.");
        isValid = false;
    }else setDateError("");

    // --- Validate Exercise ---
    if (!exercise) {
      setExError("Required");
      isValid = false;
    }else setExError("");

    // --- Validate Field ---
    if (exercise && !field) {
      setFieldError("Required");
      isValid = false;
    }else setFieldError("");

    return isValid;
  };

  const onAdd = async () => {
    setSubmitAttempted(true);
    if(!areInputsValid()) return;

    setSubmitting(true);

    const data = {
        userid: userId,
        title,
        targetExerciseid: exercise!.id,
        targetField: field,
        currentValue: parseFloat(currentValue),
        targetValue: parseFloat(targetValue),
        initialValue: parseFloat(currentValue),
        targetDate: targetDate!
    }

    await addGoal(data);
    resetSearch();
    setAddGoal(false);
    
  }

  return (
    <div className="border p-5 rounded-md bg-zinc-100">
      <h3 className="mb-1.5">Goal Details</h3>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-between">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Enter Goal title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-sm py-2 focus:border focus:border-zinc-400"
                />
                {titleError && <span className="error">{titleError}</span>}
              </div>
              <div className="flex flex-col gap-1">
                {data && <Combobox choices={data} setChoice={setExercise} />}
                {exError && <span className="error">{exError}</span>}
              </div>
              <div className="flex flex-col gap-1">
                {exercise && (
                  <Selector
                    choices={validCategoryFields[exercise.category]}
                    selectedValue={field}
                    placeholder="Select Parameter"
                    setChoice={setField}
                    classes="bg-white hover:bg-zinc-100"
                  />
                )}
                {fieldError && <span className="error">{fieldError}</span>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-5">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Current Value"
                  value={currentValue}
                  onChange={(e) => setCurrValue(e.target.value)}
                  className="text-sm py-2 focus:border focus:border-zinc-400"
                />
                {currValError && <span className="error">{currValError}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Target Value"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="text-sm py-2 focus:border focus:border-zinc-400"
                />
                {targetValError && <span className="error">{targetValError}</span>}
              </div>
              <div>
                <DatePicker label="" date={targetDate} setDate={setTargetDate} />
                {dateError && <span className="error">{dateError}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:w-40 mt-5 items-center w-full md:mt-0">
            <Button variant="default" className="w-full" disabled={submitting} onClick={onAdd}>{submitting ? "Adding":"Add"}</Button>
            <Button variant="outline" className="w-full" disabled={submitting} onClick={() => setAddGoal(false)}>Cancel</Button>
          </div>
      </div>
    </div>
  );
};

export default AddGoal;
