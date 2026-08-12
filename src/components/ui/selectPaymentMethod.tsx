import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setPaymentMethods } from "@/Redux/Slices/PaymentMethodSlice";
import UseFindPaymentMethodViewModel from "@/ViewModels/PaymentMethods/FindPaymentMethodsViewModel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import Select from "./Select";

interface SelectPaymentMethosProps {
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void;
    isCreditSelected?: boolean
}

const SelectPaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod, isCreditSelected }: SelectPaymentMethosProps) => {
    const t = useTranslations('addTransaction');
    const dispatch = useDispatch();
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { paymentMethod, find } = UseFindPaymentMethodViewModel({ UserId: userId });

    useEffect(() => {
        find();
    }, [find]);

    useEffect(() => {
        if (isCreditSelected) {
            const creditMethod = paymentMethod.filter(({ description }) => description == 'Crédito')[0];
            setSelectedPaymentMethod(creditMethod);
        }
    }, [isCreditSelected, paymentMethod, setSelectedPaymentMethod]);


    useEffect(() => {
        if (paymentMethod.length > 0) {
            dispatch(setPaymentMethods(paymentMethod));
        }
    }, [paymentMethod, dispatch]);

    const handlePaymentMethodChange = (value: string) => {
        if (value) {
            const paymentMethod = JSON.parse(value);
            setSelectedPaymentMethod(paymentMethod);
        }
    };

    const displayLabel = selectedPaymentMethod ? selectedPaymentMethod.description : "";

    return (
        <div className="w-full">
            <Select.Root
                value={selectedPaymentMethod ? JSON.stringify(selectedPaymentMethod) : ""}
                onChange={handlePaymentMethodChange}
                placeholder={t('selectPaymentMethod')}
            >
                <Select.Trigger displayValue={displayLabel} />
                <Select.Content>
                    {paymentMethod.map((pm) => (
                        <Select.Option key={pm.id} value={JSON.stringify(pm)}>
                            {pm.description}
                        </Select.Option>
                    ))}
                </Select.Content>
            </Select.Root>
        </div>
    );
};

export default SelectPaymentMethod;
