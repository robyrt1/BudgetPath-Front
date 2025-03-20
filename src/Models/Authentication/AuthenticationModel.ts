import { UrlsService } from "@/shared/Constants/URLS";
import { get } from "lodash";
import { AuthenticationModelPort } from "./Port/AuthenticationModelPort";
import { RequestAuthentication } from "./Requests/RequestAuthentication";
import { ResponseAuthentication } from "./Responses/ResponseAuthentication";


const AuthenticationModel: AuthenticationModelPort = {
    LoginUser: async (request: RequestAuthentication): Promise<ResponseAuthentication> => {
        try {
            const response = await fetch(UrlsService.URL_FINANCE_API?.replace('/odata', '') + 'auth', { method: 'Post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
            const result = await response.json();
            if (!response.ok) {
                throw new AggregateError([], 'Verifique seu email e senha se está correto.', { cause: get(result, 'details') });
            }
            return result;
        } catch (error) {
            const messageError = String(get(error, 'cause'));
            return { status: false, details: messageError }
        }
    }
}

export default AuthenticationModel

