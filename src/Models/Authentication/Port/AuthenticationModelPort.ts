import { RequestAuthentication } from "../Requests/RequestAuthentication";
import { ResponseAuthentication } from "../Responses/ResponseAuthentication";

export interface AuthenticationModelPort {
    LoginUser(request: RequestAuthentication): Promise<ResponseAuthentication>
}