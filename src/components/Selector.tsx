import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

type SelectorProps = {
  choices: Array<{ label: string; val: string }>;
  setChoice: Dispatch<SetStateAction<string>>;
  placeholder: string;
  selectedValue: string;
  classes?: string
};

const Selector = ({
  choices,
  setChoice,
  placeholder,
  selectedValue,
  classes
}: SelectorProps
) => {
  return (
    <Select value={selectedValue} onValueChange={setChoice}>
      <SelectTrigger className={clsx(classes)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {choices.map(({ label, val }) => (
          <SelectItem key={val} value={val}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Selector;
