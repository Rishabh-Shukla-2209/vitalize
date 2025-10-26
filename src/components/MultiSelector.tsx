import { Dispatch, SetStateAction } from "react";
import {
  MultiSelect,
  MultiSelectTrigger,
  MultiSelectValue,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
} from "./ui/multi-select";
import clsx from "clsx";

type MultiSelectorProps = {
  choices: Array<{ label: string; val: string }>;
  setChoices: Dispatch<SetStateAction<string[]>>;
  placeholder: string;
  selectedValues: string[];
  classes?: string;
};

const MultiSelector = ({
  choices,
  setChoices,
  placeholder,
  selectedValues,
  classes,
}: MultiSelectorProps) => {
  return (
    <MultiSelect values={selectedValues} onValuesChange={setChoices}>
      <MultiSelectTrigger className={clsx("w-full max-w-[340px]", classes)}>
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {choices.map(({ label, val }) => (
          <MultiSelectItem key={label} value={val}>
            {label}
          </MultiSelectItem>
        ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default MultiSelector;
