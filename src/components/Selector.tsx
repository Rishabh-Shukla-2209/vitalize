import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Selector = ({
  choices,
  choice,
  setChoice,
}: {
  choices: string[];
  choice: string;
  setChoice: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Select value={choice} onValueChange={setChoice}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={choice} />
      </SelectTrigger>
      <SelectContent>
        {choices.map((choice) => (
          <SelectItem key={choice} value={choice}>
            {choice}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Selector;
