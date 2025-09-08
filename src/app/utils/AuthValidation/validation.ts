import z from "zod";


export const registerValidation = z.object({
    name: z.string().min(3).max(255),
    email: z.string(),
    password: z.string().min(6).max(255),
});

export const loginValidation = z.object({
    email: z.string(),
    password: z.string().min(6).max(255),
});


export type RegisterValidation = z.infer<typeof registerValidation>;
export type LoginValidation = z.infer<typeof loginValidation>;