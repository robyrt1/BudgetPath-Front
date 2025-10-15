import { FindByUseRequest } from "../Requests/FindByUser";
import { Debt } from "../Responses/FindByUser";

export interface IDebtsModelPort {
    findByUser(input: FindByUseRequest): Promise<Debt[]>
}