import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectorProps = {
  choices: Array<{ label: string; val: string }>;
  setChoice: Dispatch<SetStateAction<string>>;
  placeholder: string;
  selectedValue: string;
};

const Selector = ({
  choices,
  setChoice,
  placeholder,
  selectedValue
}: SelectorProps
) => {
  return (
    <Select value={selectedValue} onValueChange={setChoice}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {choices.map(({ label, val }) => (
          <SelectItem key={label} value={val}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Selector;
