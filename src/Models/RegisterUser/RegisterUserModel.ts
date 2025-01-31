import { ErrorResponse } from "@/shared/Interfaces/ErrorResponse";
import { RegisterUserModelPort } from "./Port/RegisterUserModelPort";
import { RegisterUserRequest } from "./Requests/RequestUserRequest";
import { RegisterUserResponse } from "./Responses/RequestUserResponse";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://192.168.8.198:5171/api/v1/';

const RegisterUserModel: RegisterUserModelPort = {
    CreateSystem: async (request: RegisterUserRequest): Promise<RegisterUserResponse | ErrorResponse> => {
        try {
            const response = await fetch(URL_FINANCE_API + 'User/registerSystem', {
                mode: 'cors',
                method: 'Post',
                headers: { 'Content-Type': 'application/json',accept: '*/*' },
                body: JSON.stringify(request),
                credentials: 'include'
            })
            if (!response.ok) {
                throw new AggregateError([],'Falhar ao registrar conta', {cause: 'Email ou senha inválido'});
            }

            return await response.json();
        } catch (error) {
            return { status: false , detail: String(error) }
        }
    }
}

export default RegisterUserModel