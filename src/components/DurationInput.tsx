import * as React from "react";
import { cn } from "@/lib/utils";

interface DurationInputProps {
  value?: number;
  onChange: (value: number) => void;
  className?: string;
}

export const DurationInput = React.forwardRef<
  HTMLInputElement,
  DurationInputProps
>(({ value = 0, onChange, className, ...props }, ref) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Number(e.target.value);
    onChange(newMinutes * 60 + seconds);
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSeconds = Number(e.target.value);
    onChange(minutes * 60 + newSeconds);
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-md bg-background px-2 py-0.5 text-sm",
        className,
      )}
    >
      <input
        {...props}
        ref={ref}
        type="number"
        min={0}
        placeholder="00"
        value={minutes === 0 ? "" : minutes}
        onChange={handleMinutesChange}
        className="input-no-spinner bg-transparent w-8 text-center px-1 placeholder:text-muted-foreground focus:outline-none border-none outline-none h-full"
      />

      <span className="shrink-0 opacity-50">min :</span>

      <input
        type="number"
        min={0}
        max={59}
        placeholder="00"
        value={seconds === 0 ? "" : seconds.toString().padStart(2, "0")}
        onChange={handleSecondsChange}
        className="input-no-spinner bg-transparent text-left px-1 placeholder:text-muted-foreground focus:outline-none border-none outline-none h-full"
      />
      <span className="shrink-0 opacity-50">s</span>
    </div>
  );
});
DurationInput.displayName = "DurationInput";
