import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";

export interface IFindPaymentMethodProps {
    UserId?: string,
}

export interface IUseFindPaymentMethodViewModel {
    error: any;
    paymentMethod: PaymentMethod[],
    SetPaymentMethod: any
    find: () => void
}