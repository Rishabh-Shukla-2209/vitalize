import { memo } from "react";
import { LineChart, ResponsiveContainer, YAxis, Line } from "recharts";

const ProgressCompChart = ({
  data,
  chartName,
}: {
  data: Array<{ name: string; val: number }>;
  chartName: string;
}) => {
  return (
    <div className="h-full w-full">
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
  );
};

export default memo(ProgressCompChart);
