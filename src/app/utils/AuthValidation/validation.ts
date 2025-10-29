import z from "zod";


export const registerValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

export const loginValidation = z.object({
    email: z.string(),
    password: z.string().min(6).max(255),
});


export type RegisterValidation = z.infer<typeof registerValidation>;
export type LoginValidation = z.infer<typeof loginValidation>;