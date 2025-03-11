import { ErrorResponse } from "@/shared/Interfaces/ErrorResponse";
import { get } from "lodash";
import { RegisterUserModelPort } from "./Port/RegisterUserModelPort";
import { RegisterUserRequest } from "./Requests/RequestUserRequest";
import { RegisterUserResponse } from "./Responses/RequestUserResponse";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://localhost:5171/api/odata/v1/';

const RegisterUserModel: RegisterUserModelPort = {
    CreateSystem: async (request: RegisterUserRequest): Promise<RegisterUserResponse | ErrorResponse> => {
        try {
            const response = await fetch(URL_FINANCE_API + 'User/registerSystem', {
                mode: 'cors',
                method: 'Post',
                headers: { 'Content-Type': 'application/json', accept: '*/*' },
                body: JSON.stringify(request)
            })
            if (!response.ok) {
                const errorBody = await response.json();
                throw new AggregateError([], 'Falhar ao registrar conta', { cause: get(errorBody, 'details') });
            }

            return await response.json();
        } catch (error) {
            return { status: false, detail: String(get(error, 'cause')) }
        }
    }
}

export default RegisterUserModel