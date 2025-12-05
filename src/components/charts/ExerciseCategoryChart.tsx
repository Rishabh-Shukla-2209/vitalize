"use client";

import { memo } from "react";
import { AreaChart, Area, YAxis, Legend, ResponsiveContainer } from "recharts";

const ExerciseCategoryChart = ({
  data,
  chartName,
}: {
  data: {
    name: string;
    val: number;
  }[];
  chartName: string;
}) => {
  return (
    <div className="h-full w-full">
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
  );
};

export default memo(ExerciseCategoryChart);
