import { z } from "zod";
import { textField } from "./text";

const cloudinaryUrlRegex =
  /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9-_]+\/image\/upload\/.+$/;

export const updateUserSchema = z
  .object({
    imgUrl: z
      .url()
      .regex(cloudinaryUrlRegex, "Invalid Cloudinary URL")
      .optional(),

    about: textField({ max: 200 }).optional(),

    bio: textField({ max: 500 }).optional(),

    privacy: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "No fields to update",
      });
    }
  });
