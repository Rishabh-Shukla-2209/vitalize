import { z } from "zod";
import { textField } from "./text";

const cloudinaryUrlRegex =
  /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9-_]+\/image\/upload\/.+$/;

export const postSchema = z
  .object({
    imgUrl: z
      .url()
      .regex(cloudinaryUrlRegex, "Invalid Cloudinary URL")
      .optional(),

    title: textField({ max: 200 }),

    body: textField({ max: 500 }).optional(),

    privacy: z.enum(["PUBLIC", "PRIVATE"]),

    workoutLogid: z.string().optional(),
  })
  .strict();
