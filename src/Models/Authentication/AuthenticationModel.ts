import { get } from "lodash";
import { AuthenticationModelPort } from "./Port/AuthenticationModelPort";
import { RequestAuthentication } from "./Requests/RequestAuthentication";
import { ErrorAuthentication, ResponseAuthentication } from "./Responses/ResponseAuthentication";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://localhost:5171/api/v1/';

const AuthenticationModel: AuthenticationModelPort = {
    LoginUser: async (request: RequestAuthentication): Promise<ResponseAuthentication | ErrorAuthentication> => {
        try {
            const response = await fetch(URL_FINANCE_API + 'auth', { method: 'Post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
            const result = await response.json();
            if (!response.ok) {
                throw new AggregateError([], 'Verifique seu email e senha se está correto.', { cause: get(result, 'details') });
            }
            return result;
        } catch (error) {
            const messageError = String(get(error, 'cause'));
            return { status: false, detail: messageError }
        }
    }
}

export default AuthenticationModel

