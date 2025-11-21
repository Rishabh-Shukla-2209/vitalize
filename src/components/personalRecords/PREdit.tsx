import { ExerciseCategoryType, PRType } from "@/lib/types";
import Icons from "../icons/appIcons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useState } from "react";
import Selector from "../Selector";
import { validCategoryFields } from "@/lib/utils";
import { changePRField } from "@/lib/queries";
import { Spinner } from "../ui/spinner";

const PREdit = ({ pr, userId, prUpdater }: { pr: PRType, userId: string, prUpdater: (prId: string, updatedField: string, updatedVal: number) => void }) => {
  const [edit, setEdit] = useState(false);
  const [newField, setNewField] = useState(pr.prField);
  const [submitting, setSubmitting] = useState(false);

  const onEdit = async () => {
    if(newField === pr.prField){
        setEdit(false);
        return;
    }
    setSubmitting(true);
    const updatedVal = await changePRField(userId, pr.id, pr.exercise.id, newField);
    prUpdater(pr.id, newField, updatedVal);
    setSubmitting(false);
    setEdit(false);
  }

  const category = pr.exercise.category as ExerciseCategoryType;
  return edit ? (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <Selector
        choices={validCategoryFields[category]}
        selectedValue={newField}
        placeholder={pr.prField}
        setChoice={setNewField}
      />
      <Button
        variant="default"
        onClick={onEdit}
        disabled={submitting}
        className="w-full md:w-auto"
      >
        {submitting ? <Spinner /> : "Done"}
      </Button>
      <Button variant="outline" className="w-full md:w-auto" onClick={() => setEdit(false)} disabled={submitting}>
        Cancel
      </Button>
    </div>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" onClick={() => setEdit(true)}>
          <Icons.edit />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="dark:bg-sage-500">
        <p className="text-white">Change what you want to track</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default PREdit;
