import { GoalType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import { abandonGoal } from "@/lib/queries";

const GoalEdit = ({ goal, goalUpdater }: { goal: GoalType, goalUpdater: (goalId: string) => void }) => {
  const [submitting, setSubmitting] = useState(false);

  const onEdit = async () => {
    setSubmitting(true);
    await abandonGoal(goal.id);
    goalUpdater(goal.id);
    setSubmitting(false);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" onClick={onEdit} disabled={submitting}>
          <Icons.abandon className="text-red-500"/>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-white">Abandon Goal</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default GoalEdit;
