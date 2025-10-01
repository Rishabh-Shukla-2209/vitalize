"use client";

import { subDays } from "date-fns";
import { useEffect, useState } from "react";
import { LineChart, Line, YAxis, Legend, ResponsiveContainer } from "recharts";
import Selector from "../Selector";
import {
  ExerciseCategory,
  getAvailableCategoriesForMuscleGroup,
  MuscleGroup,
  MuscleGroups,
} from "@/lib/utils";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { getMuscleGroupData } from "@/lib/db";
const ProgressCompChart = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<Array<{ name: string; val: number }>>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("CHEST");
  const [progressType, setProgressType] = useState("STRENGTH");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    subDays(new Date(), 30)
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const progressTypeOptions = getAvailableCategoriesForMuscleGroup(
    selectedMuscleGroup as MuscleGroup
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

  const updateData = async (userId: string) => {
    const updatedData = await getMuscleGroupData(
      userId,
      selectedMuscleGroup as MuscleGroup,
      progressType as ExerciseCategory,
      dateFrom,
      dateTo
    );
    setData(updatedData);
  };

  const chartName = "Not yet Decided";
  return (
    <div className="boundary p-5">
      <h3 className="text-lg text-gray-600 mb-2">Progress by Muscle Type</h3>
      <div className="flex gap-5">
        <Selector
          choice={selectedMuscleGroup}
          setChoice={setSelectedMuscleGroup}
          choices={MuscleGroups}
        />
        <Selector
          choice={progressType}
          setChoice={setProgressType}
          choices={progressTypeOptions}
        />
        <DatePicker label="From:" date={dateFrom} setDate={setDateFrom} />
        <DatePicker label="To:" date={dateTo} setDate={setDateTo} />
        <Button variant="default" onClick={() => updateData(userId)}>Go</Button>
      </div>
      <div className="h-90 w-170 mx-auto mt-5 flex-center">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="bg-zinc-50 rounded-lg"
        >
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
          >
            <YAxis />
            <Legend />
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
