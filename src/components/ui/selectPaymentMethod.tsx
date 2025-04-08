import { PaymentMethod } from "@/Models/PaymentMethod/Responses/ResponseFindPaymentMethods";
import { AuthState } from "@/Redux/Slices/AutheticationSlice";
import { setPaymentMethods } from "@/Redux/Slices/PaymentMethodSlice";
import UseFindPaymentMethodViewModel from "@/ViewModels/PaymentMethods/FindPaymentMethodsViewModel";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SelectPaymentMethosProps {
    selectedPaymentMethod: PaymentMethod | null;
    setSelectedPaymentMethod: (paymentMethod: PaymentMethod) => void;
}

const SelectPaymentMethod = ({ selectedPaymentMethod, setSelectedPaymentMethod }: SelectPaymentMethosProps) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: { auth: AuthState }) => state.auth.userId);
    const { paymentMethod, find } = UseFindPaymentMethodViewModel({ UserId: userId });

    useEffect(() => {
        find();
    }, []);

    useEffect(() => {
        if (paymentMethod.length > 0) {
            dispatch(setPaymentMethods(paymentMethod));
        }
    }, [paymentMethod]);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const paymentMethod = JSON.parse(event.target.value);
        setSelectedPaymentMethod(paymentMethod);
    };

    return (
        <div>

            <select
                value={JSON.stringify(selectedPaymentMethod)}
                onChange={handlePaymentMethodChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                <option value="">Select Payment Method</option>
                {paymentMethod.map((paymentMethod: PaymentMethod) => (
                    <option key={paymentMethod.id} value={JSON.stringify(paymentMethod)}>
                        {paymentMethod.description}
                    </option>
                ))}
            </select>

        </div>
    );
};

export default SelectPaymentMethod;
