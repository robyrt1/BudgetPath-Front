import { CreateCreditCardRequest } from "../Requests/CreateCreditCardRequest";
import { UpdateCreditCardRequest } from "../Requests/UpdateCreditCardRequest";
import { DeleteCreditCardRequest } from "../Requests/DeleteCreditCardRequest";

export interface ICreditCardsModelPort {
    create(request: CreateCreditCardRequest): Promise<unknown>;
    update(request: UpdateCreditCardRequest): Promise<unknown>;
    delete(request: DeleteCreditCardRequest): Promise<unknown>;
}
