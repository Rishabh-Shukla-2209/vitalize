"use client";

import { AreaChart, Area, YAxis, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { ExerciseCategories, ExerciseCategory } from "@/lib/utils";
import { getExerciseCatData } from "@/lib/db";
import { subDays } from "date-fns";
import { DatePicker } from "../DatePicker";
import Selector from "../Selector";
import { Button } from "../ui/button";

const ExerciseCategoryChart = ({ userId }: { userId: string }) => {
  const [selectedCategory, setSelectedCategory] = useState("STRENGTH");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    subDays(new Date(), 30)
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());

  const categories = ExerciseCategories;

  const [data, setData] = useState<Array<{name: string, val: number}>>([]);

  useEffect(() => {
    const getData = async (userId: string) => {
      const end = new Date();
      const start = subDays(end, 30);
      const chartData = await getExerciseCatData(userId, "STRENGTH", start, end);
      setData(chartData);
    }
    getData(userId);
  }, [userId])

  const updateData = async (userId: string) => {
    const updatedData = await getExerciseCatData(userId, selectedCategory as ExerciseCategory, dateFrom, dateTo);
    setData(updatedData);
  }


  const chartName = `${selectedCategory} PROGRESS`;

  return (
    <div className="boundary p-5">
      <h3 className="text-lg text-gray-600 mb-2">Progress by Workout Type</h3>
      <div className="flex gap-10">
        <Selector
          choices={categories}
          choice={selectedCategory}
          setChoice={setSelectedCategory}
        />
        <DatePicker label="From:" date={dateFrom} setDate={setDateFrom} />
        <DatePicker label="To:" date={dateTo} setDate={setDateTo} />
        <Button variant='default' onClick={() => updateData(userId)}>Go</Button>
      </div>
      <div className="h-90 w-170 mx-auto mt-2.5 flex-center">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={300}
            data={data}
            margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
          >
            <YAxis />
            <Legend />
            <Area
              name={chartName}
              type="monotone"
              dataKey="val"
              stroke="#38e07b"
              fill="#38e07b"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExerciseCategoryChart;
