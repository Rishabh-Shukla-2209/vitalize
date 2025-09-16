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