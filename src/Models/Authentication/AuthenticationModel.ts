import { get } from "lodash";
import { AuthenticationModelPort } from "./Port/AuthenticationModelPort";
import { RequestAuthentication } from "./Requests/RequestAuthentication";
import { ResponseAuthentication } from "./Responses/ResponseAuthentication";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://localhost:5171/api/v1/';

const AuthenticationModel: AuthenticationModelPort = {
    LoginUser: async (request: RequestAuthentication): Promise<ResponseAuthentication> => {
        try {
            const response = await fetch(URL_FINANCE_API + 'auth', { method: 'Post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
            if (!response.ok) {
                const errorBody = await response.json();
                throw new AggregateError([], 'Verifique seu email e senha se está correto.', { cause: get(errorBody, 'details') });
            }

            return await response.json();
        } catch (error) {
            return { status: false, detail: String(get(error, 'cause')) }
        }
    }
}

export default AuthenticationModel