"use client";

import { subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import Selector from "../Selector";
import {
  getAvailableCategoriesForMuscleGroup,
  handleAppError,
  MuscleGroups,
} from "@/lib/utils";
import { ExerciseCategoryType, MuscleGroupType } from "@/lib/types";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { getMuscleGroupData } from "@/lib/actions/charts";
import { Spinner } from "../ui/spinner";
import ProgressCompChart from "./ProgressCompChart";
const ProgressComp = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<Array<{ name: string; val: number }>>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [progressType, setProgressType] = useState("");
  const [muscleGroupError, setMuscleGroupError] = useState(false);
  const [progressTypeError, setProgressTypeError] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    subDays(new Date(), 30),
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);
  const progressTypeOptions = getAvailableCategoriesForMuscleGroup(
    selectedMuscleGroup as MuscleGroupType,
  );
  const chartName = useRef(`${selectedMuscleGroup} - ${progressType} PROGRESS`);

  useEffect(() => {
    const getData = async () => {
      const end = new Date();
      const start = subDays(end, 30);
      try {
        const chartData = await getMuscleGroupData(
          "CHEST",
          "STRENGTH",
          start,
          end,
        );
        setData(chartData!);
      } catch (err) {
        handleAppError(err);
      }
    };
    getData();
  }, [userId]);

  useEffect(() => {
    setProgressType("");
    setMuscleGroupError(false);
  }, [selectedMuscleGroup]);

  const updateData = async () => {
    if (!progressType || !selectedMuscleGroup) {
      if (!progressType) setProgressTypeError(true);
      if (!selectedMuscleGroup) setMuscleGroupError(true);
    } else if (dateError) return;
    else {
      setLoading(true);
      try {
        const updatedData = await getMuscleGroupData(
          selectedMuscleGroup as MuscleGroupType,
          progressType as ExerciseCategoryType,
          dateFrom,
          dateTo,
        );
        setData(updatedData!);
        chartName.current = `${selectedMuscleGroup} - ${progressType} PROGRESS`;
      } catch (err) {
        handleAppError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setProgressTypeError(false);
  }, [progressType]);

  useEffect(() => {
    if (!dateFrom) {
      setDateError("Start date is required.");
    } else if (!dateTo) {
      setDateError("End date is required.");
    } else if (dateFrom >= dateTo) {
      setDateError("Start date must be before end date.");
    } else {
      setDateError("");
    }
  }, [dateTo, dateFrom]);

  return (
    <div className="boundary p-5 dark:bg-sage-400">
      <h3 className="mb-2">Progress by Muscle Type</h3>
      <div className="flex flex-wrap gap-2 md:gap-5">
        <div>
          <Selector
            setChoice={setSelectedMuscleGroup}
            choices={MuscleGroups}
            placeholder="Chest"
            selectedValue={selectedMuscleGroup}
          />
          {muscleGroupError && <span className="error">Required</span>}
        </div>
        <div>
          <Selector
            setChoice={setProgressType}
            choices={progressTypeOptions}
            placeholder="Strength"
            selectedValue={progressType}
          />
          {progressTypeError && <span className="error">Required</span>}
        </div>
        <div className="flex flex-col gap-1">
          <DatePicker label="From:" date={dateFrom} setDate={setDateFrom} />
          {dateError && <span className="error">{dateError}</span>}
        </div>
        <DatePicker label="To:" date={dateTo} setDate={setDateTo} />
        <Button variant="default" onClick={updateData} disabled={loading}>
          {loading ? <Spinner /> : "Go"}
        </Button>
      </div>
      <div className="h-60 sm:h-70 md:h-80 lg:h-90 m-auto mx-auto mt-5 flex-center">
        <ProgressCompChart data={data} chartName={chartName.current} />
      </div>
    </div>
  );
};

export default ProgressComp;
