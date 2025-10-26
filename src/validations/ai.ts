import { z } from "zod";

export const aiWorkoutSchema = z.object({
  name: z.string(),
  description: z.string(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  duration: z.number(),
  exercises: z.array(
    z.object({
      position: z.number(),
      name: z.string(),
      benefit: z.string().max(50),
      sets: z.number().min(1),
      reps: z.number().min(1),
      rest: z.number(),
      distance: z.number().optional(),
      time: z.number().optional(),
      exerciseId: z.string(),
    })
  ),
});


export type AiWorkoutSchemaType = z.infer<typeof aiWorkoutSchema>;
