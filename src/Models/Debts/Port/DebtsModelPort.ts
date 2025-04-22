import { FindByUseRequest } from "../Requests/FindByUser";
import { Debts } from "../Responses/FindByUser";

export interface IDebtsModelPort {
    findByUser(input: FindByUseRequest): Promise<Debts[]>
}