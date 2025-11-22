import * as React from "react"
import { cn } from "@/lib/utils"

interface DistanceInputProps {
  value?: number
  onChange: (value: number) => void
  className?: string
}

export const DistanceInput = React.forwardRef<HTMLInputElement, DistanceInputProps>(
  ({ value = 0, onChange, className, ...props }, ref) => {
    const kilometers = Math.floor(value / 1000)
    const meters = value % 1000

    const handleKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newKm = Number(e.target.value)
      onChange(newKm * 1000 + meters)
    }

    const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMeters = Number(e.target.value)
      onChange(kilometers * 1000 + newMeters)
    }

    return (
      <div
        className={cn(
          "flex w-full items-center justify-center rounded-md bg-background px-2 py-0.5 text-sm",
          className
        )}
      >
        <input
          {...props}
          ref={ref}
          type="number"
          min={0}
          placeholder="0"
          value={kilometers === 0 ? "" : kilometers}
          onChange={handleKmChange}
          className="input-no-spinner bg-transparent w-10 text-center px-1 placeholder:text-muted-foreground focus:outline-none border-none outline-none h-full" 
        />
        
        <span className="shrink-0 opacity-50">km :</span>
        
        <input
          type="number"
          min={0}
          max={999}
          placeholder="000"
          value={meters === 0 ? "" : meters.toString().padStart(3, '0')}
          onChange={handleMetersChange}
          className="input-no-spinner bg-transparent text-left px-1 placeholder:text-muted-foreground focus:outline-none border-none outline-none h-full"
        />
        <span className="shrink-0 opacity-50">m</span>
      </div>
    )
  }
)
DistanceInput.displayName = "DistanceInput"