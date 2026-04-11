import { CreateDebtRequest } from "../Requests/CreateDebtRequest";
import { FindByUseRequest } from "../Requests/FindByUser";
import { Debt } from "../Responses/FindByUser";

export interface IDebtsModelPort {
    findByUser(input: FindByUseRequest): Promise<Debt[]>;
    createDebt(input: CreateDebtRequest): Promise<void>;
    deleteDebt(debtId: string): Promise<void>;
}