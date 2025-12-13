import { ExerciseCategoryType } from "@/lib/types";
import { startOfDay } from "date-fns";
import { z } from "zod";

export const goalSchema = z.object({
  title: z
    .string()
    .min(1, "Required")
    .regex(
      /^[A-Za-z0-9 _-]+$/,
      "Title should only contain letters and numbers.",
    ),
  exercise: z
    .object({
      id: z.string(),
      name: z.string(),
      category: z.custom<ExerciseCategoryType>(),
    })
    .optional()
    .refine((val) => val !== undefined, "Required"),
  field: z.string().min(1, "Required"),

  currentValue: z
    .number()
    .min(0, "Must be 0 or more")
    .optional()
    .refine((val) => val !== undefined, "Required"),

  targetValue: z
    .number()
    .min(0, "Must be 0 or more")
    .optional()
    .refine((val) => val !== undefined, "Required"),

  targetDate: z
    .date()
    .optional()
    .refine((val) => val !== undefined, "Required")
    .refine((date) => {
      return date && date >= startOfDay(new Date());
    }, "Date can't be in the past."),
});

export type GoalFormValues = z.infer<typeof goalSchema>;
