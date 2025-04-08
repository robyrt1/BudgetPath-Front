import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const InitalState: PaymentMethod[] = [{
    id: "",
    description: "",
    descriptionLower: "",
    userId: "",
    user: null
}]

const PaymentMethodSlice = createSlice({
    name: 'paymentMethod',
    initialState: [...InitalState],
    reducers: {
        setPaymentMethods: (state: any, action: PayloadAction<PaymentMethod[] | null>) => {
            if (action.payload) {
                state = action.payload
            }
        }
    }
})

export const { setPaymentMethods } = PaymentMethodSlice.actions;
export default PaymentMethodSlice.reducer