import { RegisterUserResponse } from "@/Models/RegisterUser/Responses/RequestUserResponse";

export interface IRegisterUserState {
    email: string;
    emailError: string | null;
    setEmail: (email: string) => void;
  
    password: string;
    passwordError: string | null;
    setPassword: (password: string) => void;

    register(): Promise<RegisterUserResponse>
  
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

