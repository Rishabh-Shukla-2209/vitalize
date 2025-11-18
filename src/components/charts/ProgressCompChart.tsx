"use client";

import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";
import Selector from "../Selector";
import {
  getAvailableCategoriesForMuscleGroup,
  MuscleGroups,
} from "@/lib/utils";
import { ExerciseCategoryType, MuscleGroupType } from "@/lib/types";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { getMuscleGroupData } from "@/lib/queries";
const ProgressCompChart = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<Array<{ name: string; val: number }>>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("");
  const [progressType, setProgressType] = useState("");
  const [muscleGroupError, setMuscleGroupError] = useState(false);
  const [progressTypeError, setProgressTypeError] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    subDays(new Date(), 30)
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const progressTypeOptions = getAvailableCategoriesForMuscleGroup(
    selectedMuscleGroup as MuscleGroupType
  );

  useEffect(() => {
    const getData = async (userId: string) => {
      const end = new Date();
      const start = subDays(end, 30);
      const chartData = await getMuscleGroupData(
        userId,
        "CHEST",
        "STRENGTH",
        start,
        end
      );
      setData(chartData);
    };
    getData(userId);
  }, [userId]);

  useEffect(() => {
    setProgressType("");
    setMuscleGroupError(false);
  }, [selectedMuscleGroup]);

  const updateData = async (userId: string) => {
    if (!progressType || !selectedMuscleGroup) {
      if (!progressType) setProgressTypeError(true);
      if (!selectedMuscleGroup) setMuscleGroupError(true);
    } else {
      const updatedData = await getMuscleGroupData(
        userId,
        selectedMuscleGroup as MuscleGroupType,
        progressType as ExerciseCategoryType,
        dateFrom,
        dateTo
      );
      setData(updatedData);
    }
  };

  useEffect(() => {
    setProgressTypeError(false);
  }, [progressType])

  const chartName = `${selectedMuscleGroup} - ${progressType} PROGRESS`;
  return (
    <div className="boundary p-5">
      <h3 className="mb-2">Progress by Muscle Type</h3>
      <div className="flex gap-5">
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
        <DatePicker label="From:" date={dateFrom} setDate={setDateFrom} />
        <DatePicker label="To:" date={dateTo} setDate={setDateTo} />
        <Button variant="default" onClick={() => updateData(userId)}>
          Go
        </Button>
      </div>
      <div className="h-90 w-170 mx-auto mt-5 flex-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
          >
            <YAxis />
            <Line
              name={chartName}
              type="bump"
              dataKey="val"
              strokeWidth={4}
              stroke="#38e07b"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressCompChart;
