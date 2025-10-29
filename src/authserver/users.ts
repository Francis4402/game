"use server";

import { auth } from "@/lib/auth"
import { headers } from "next/headers";


export const signIn = async (email: string, password: string) => {
    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            }
        })

        return {
            success: true,
            message: "Login Successful"
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "Login Failed"
        }
    }
}

export const signUp = async (name: string, email: string, password: string) => {
    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            }
        })

        return {
            success: true,
            message: "Sign Up Successful"
        }
    } catch (error) {
        const e = error as Error
        return {
            success: false,
            message: e.message || "Sign Up Failed"
        }
    }
}

export const userData = async () => {
    const session = await auth.api.getSession({headers: await headers()});

    if (!session) 
        return null;
    
    return session;
}