import { ErrorResponse } from "@/shared/Interfaces/ErrorResponse";
import { RegisterUserRequest } from "../Requests/RequestUserRequest";
import { RegisterUserResponse } from "../Responses/RequestUserResponse";

export interface RegisterUserModelPort {
    CreateSystem(request:RegisterUserRequest) : Promise<RegisterUserResponse | ErrorResponse>;
    CreateFirebase(request: { name: string; email: string; idToken: string }): Promise<any>;
}