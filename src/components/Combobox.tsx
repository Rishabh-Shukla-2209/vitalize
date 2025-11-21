"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExerciseCategoryType } from "@/lib/types";

const Combobox = ({
  choices,
  setChoice,
}: {
  choices: Array<{ id: string; name: string; category: ExerciseCategoryType }>;
  setChoice: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          name: string;
          category: ExerciseCategoryType;
        }
      | undefined
    >
  >;
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between dark:bg-sage-400"
        >
          {value
            ? value
            : "Select Exercise..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Exercise..." className="h-9" />
          <CommandList>
            <CommandEmpty>No exercise found.</CommandEmpty>
            <CommandGroup>
              {choices.map((choice) => (
                <CommandItem
                  key={choice.id}
                  value={choice.name}
                  onSelect={(currentValue) => {
                    const isSame = currentValue === value;
                    setValue(isSame ? "" : currentValue);
                    setChoice(isSame ? undefined : choice);
                    setOpen(false);
                  }}
                >
                  {choice.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === choice.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(Combobox);
