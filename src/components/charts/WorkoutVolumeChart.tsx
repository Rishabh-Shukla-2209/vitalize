import { getLastWeekVol } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import WorkoutVolumeChartSkeleton from "./WorkoutVolumeChartSkeleton";

const WorkoutVolumeChart = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weeklyChartData", userId],
    queryFn: () => getLastWeekVol(userId),
    staleTime: 12 * 60 * 60 * 1000,
  });
  if (isLoading || isError || !data) {
    return <WorkoutVolumeChartSkeleton />;
  }

  const totalVolCurrent = data.totalVolCurrent;
  const totalVolPrev = data.totalVolPrev;
  const change =
    totalVolPrev === 0
      ? totalVolCurrent === 0
        ? 0
        : 100
      : (
          (Math.abs(totalVolCurrent - totalVolPrev!) / totalVolPrev) *
          100
        ).toFixed(0);

  return (
    <div className="boundary p-5">
      <h3>Total Volume</h3>
      <p className="text-3xl font-bold my-1.5">
        {totalVolCurrent.toLocaleString("en-US")} kg
      </p>
      <p className="text-lg">
        Last 7 days{" "}
        <span
          className={clsx(
            { "text-green-500": totalVolCurrent >= totalVolPrev },
            { "text-red-500": totalVolCurrent < totalVolPrev }
          )}
        >
          {change}%
        </span>
      </p>
      <div className="h-90 w-170 m-auto flex-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={250}
            data={data.lastWeekVolData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <Legend />
            <Bar
              name="Workout Volume for the last 7 days"
              dataKey="vol"
              fill="#38e07b"
              activeBar={<Rectangle fill="#a6f9b2" stroke="#13ec13" />}
            >
              <LabelList dataKey="vol" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkoutVolumeChart;
