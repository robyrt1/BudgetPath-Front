import { UrlsService } from "@/shared/Constants/URLS";
import { ResponseFindPaymentMethods } from "./Responses/ResponseFindPaymentMethods";


const PaymentMethodsModel = {
    FindPaymentMethods: async (): Promise<ResponseFindPaymentMethods> => {
        const response = await fetch(UrlsService.URL_FINANCE_API + `PaymentMethod`, { method: 'Get', headers: { 'Content-Type': 'application/json' } })
        const result: ResponseFindPaymentMethods = await response.json();
        return result;
    }
}


export default PaymentMethodsModel;