import { ResponseAuthentication } from "@/Models/Authentication/Responses/ResponseAuthentication";

export interface IAuthenticationState {
    email: string;
    emailError: string | null;
    setEmail: (email: string) => void;
  
    password: string;
    passwordError: string | null;
    setPassword: (password: string) => void;

    signUp(): Promise<ResponseAuthentication>
  
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

