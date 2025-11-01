import { useRef } from "react";
import { Button } from "./ui/button";

export function FilePicker({
  onChange,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-start gap-2">
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {/* Custom button */}
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Change Photo
      </Button>
    </div>
  );
}
