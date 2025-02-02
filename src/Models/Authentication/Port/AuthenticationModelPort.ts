import { RequestAuthentication } from "../Requests/RequestAuthentication";
import { ErrorAuthentication, ResponseAuthentication } from "../Responses/ResponseAuthentication";

export interface AuthenticationModelPort {
    LoginUser(request: RequestAuthentication) : Promise<ResponseAuthentication | ErrorAuthentication>
}