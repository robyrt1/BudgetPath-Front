import { AuthenticationModelPort } from "./Port/AuthenticationModelPort";
import { RequestAuthentication } from "./Requests/RequestAuthentication";
import { ResponseAuthentication } from "./Responses/ResponseAuthentication";

const URL_FINANCE_API: string = process.env.REACT_APP_API_FINANCE_URL as string || 'http://localhost:5171/api';

const AuthenticationModel: AuthenticationModelPort = {
    LoginUser: async (request: RequestAuthentication): Promise<ResponseAuthentication> => {
        try {
            const response = await fetch(URL_FINANCE_API + 'SignUp', { method: 'Post', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) })
            if (!response.ok) {
                throw new AggregateError([],'Falha na autenticação', {cause: 'Email ou senha inválido'});
            }

            return await response.json();
        } catch (error) {
            return { status: false, detail: String(error) }
        }
    }
}

export default AuthenticationModel