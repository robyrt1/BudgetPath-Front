import { ErrorAuthentication, ResponseAuthentication } from "@/Models/Authentication/Responses/ResponseAuthentication";

export interface IAuthenticationState {
    email: string;
    emailError: string | null;
    setEmail: (email: string) => void;

    password: string;
    passwordError: string | null;
    setPassword: (password: string) => void;

    signIn(): Promise<ResponseAuthentication | ErrorAuthentication>
    signInWithGoogle(): Promise<any>
    errorSign: string | null;

    loading: boolean;
    setLoading: (loading: boolean) => void;
}

