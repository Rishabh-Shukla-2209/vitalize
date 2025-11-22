import { z } from 'zod'

const passwordSchema = z
    .string()
    .min(8, "Password must be atleast 8 characters long")
    .regex(/[A-Z]/, "Password must contain a capital letter")
    .regex(/[a-z]/, "Password must contain a small letter")
    .regex(/[0-9]/, "Password must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special charachter")

export const registerSchema = z.object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must have atleast 8 characters"),
})

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, "Required")
    .regex(/^[A-Za-z]+$/, "Invalid name. Name should only contain letters."),
  lastName: z
    .string()
    .min(1, "Required")
    .regex(/^[A-Za-z]+$/, "Invalid name. Name should only contain letters."),
  gender: z.string().min(1, "Required"),
  height: z
    .string()
    .min(1, "Required")
    .regex(/^[1-9]\d*$/, "Enter a valid value between 50 and 250. No decimals.")
    .refine((val) => {
      const n = Number(val);
      return n >= 50 && n <= 250;
    }, "Enter a valid value between 50 and 250. No decimals."),
  weight: z
    .string()
    .min(1, "Required")
    .regex(/^[1-9]\d*$/, "Enter a valid value between 20 and 300. No decimals.")
    .refine((val) => {
      const n = Number(val);
      return n >= 20 && n <= 300;
    }, "Enter a valid value between 20 and 300. No decimals."),
  dob: z.date(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;