import { PRType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { fitnessMetricUnits } from "@/lib/utils";

const PR = ({ pR }: { pR: PRType }) => {

  return (
    <div className="flex gap-2 w-full py-2 bg-zinc-50 rounded-lg my-1">
      <div className="flex-center flex-1">
        <Icons.trophy className="text-primary rounded-lg bg-zinc-100 p-2" size={50} />
      </div>
      <div className="flex flex-col justify-around w-full flex-5 pr-3">
        <h4>{pR.exercise.name}</h4>
        <p className="text-zinc-700">{pR.prValue} {fitnessMetricUnits[pR.prField as keyof typeof fitnessMetricUnits]}</p>
      </div>
    </div>
  );
};

export default PR;
