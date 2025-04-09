import PaymentMethodModel from "@/Models/PaymentMethod/PaymentMethodModal";
import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { setPaymentMethods } from "@/Redux/Slices/PaymentMethodSlice";
import { get, stubTrue } from "lodash";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IFindPaymentMethodProps, IUseFindPaymentMethodViewModel } from "./Types/FindPaymentMethodViewModel.type";


const UseFindPaymentMethodViewModel = (props: IFindPaymentMethodProps): IUseFindPaymentMethodViewModel => {
    const dispatch = useDispatch();
    const [error, SetError] = useState(null);
    const [paymentMethod, SetPaymentMethod] = useState<PaymentMethod[]>([]);

    return {
        paymentMethod,
        SetPaymentMethod,
        error,
        find: async () => {

            const response = await PaymentMethodModel.FindPaymentMethods();
            if (!get(response, 'Succeeded', stubTrue())) {
                const message = get(response, 'details', null)
                SetError(message);
            }
            SetPaymentMethod(response.data as unknown as PaymentMethod[])

            dispatch(setPaymentMethods(paymentMethod));
            return;
        }
    }
}

export default UseFindPaymentMethodViewModel;