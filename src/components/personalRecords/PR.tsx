import { PRType } from "@/lib/types";
import Icons from "../icons/appIcons";
import {
  fitnessMetricUnits,
  fitnessMetricLabels,
  timeAgo,
  formatDuration,
  formatDistance,
} from "@/lib/utils";

const PR = ({ pR }: { pR: PRType }) => {
  return (
    <div className="flex gap-2 w-full py-2 bg-zinc-50 dark:bg-sage-400 rounded-lg my-1">
      <div className="flex-center ml-2.5">
        <Icons.trophy
          className="text-primary rounded-lg bg-zinc-100 dark:bg-sage-500 p-2"
          size={50}
        />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 w-full flex-5 pr-3">
        <div>
          <h4 className="wrap-break-word">{pR.exercise.name}</h4>
          <div className="flex gap-2">
            <p className="wrap-break-word">
              {
                fitnessMetricLabels[
                  pR.prField as keyof typeof fitnessMetricLabels
                ]
              }
              :
            </p>
            <p>
              {pR.prField === "time" ||
              pR.prField === "duration" ||
              pR.prField === "tug" ||
              pR.prField === "plankHoldTime" ||
              pR.prField === "workIntervalDuration" ||
              pR.prField === "timeToExhaustion" ||
              pR.prField === "restIntervalDuration"
                ? formatDuration(pR.prValue)
                : pR.prField === "distance"
                ? formatDistance(pR.prValue)
                : pR.prValue}{" "}
              {
                fitnessMetricUnits[
                  pR.prField as keyof typeof fitnessMetricUnits
                ]
              }
            </p>
          </div>
        </div>
        <div>
          <p>{timeAgo(pR.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PR;
