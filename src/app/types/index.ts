

export interface User {
    user?: {
        id?: string | null | undefined;
        name?: string | null | undefined;
        image?: string | null | undefined;
        email?: string | null | undefined;
        role?: string | null | undefined;
    }
}

export interface registerType {
    name: string;
    email: string;
    password: string;
}

export interface loginType {
    email: string;
    password: string;
}

export interface ForgotPasswordType {
    email: string;
}


export interface ResetPasswordType {
    token: string;
    newPassword: string;
}