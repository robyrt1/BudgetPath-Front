import { User } from "@/Models/Transactions/Responses/ResponseTransacrions";

export interface ResponseFindPaymentMethods {
    "pageNumber": number;
    "pageSize": number;
    "firstPage": number;
    "lastPage": number;
    "totalPages": 1;
    "totalRecords": 9;
    "nextPage": number;
    "previousPage": number;
    data: PaymentMethod[]
    "succeeded": boolean;
    "errors": any
    "message": string
}

export interface PaymentMethod {
    "id": string,
    "description": string,
    "descriptionLower": string,
    "userId": string,
    "user": User | null
}
