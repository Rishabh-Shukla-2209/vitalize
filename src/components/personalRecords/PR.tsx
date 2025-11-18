import { PRType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { fitnessMetricUnits, fitnessMetricLabels, timeAgo } from "@/lib/utils";

const PR = ({ pR }: { pR: PRType }) => {

  return (
    <div className="flex gap-2 w-full py-2 bg-zinc-50 rounded-lg my-1">
      <div className="flex-center ml-2.5">
        <Icons.trophy className="text-primary rounded-lg bg-zinc-100 p-2" size={50} />
      </div>
      <div className="flex justify-between w-full flex-5 pr-3">
        <div>
          <h4>{pR.exercise.name}</h4>
          <div className="flex gap-2">
            <p>{fitnessMetricLabels[pR.prField as keyof typeof fitnessMetricLabels]}:</p>
            <p>{pR.prValue} {fitnessMetricUnits[pR.prField as keyof typeof fitnessMetricUnits]}</p>
          </div>
        </div>
        <div className="flex-center">
          <p>{timeAgo(pR.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PR;
