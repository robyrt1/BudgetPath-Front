import RegisterUserModel from "@/Models/RegisterUser/RegisterUserModel";
import { get, stubTrue } from "lodash";
import { useReducer, useState } from "react";
import { EmailReducer, PasswordReducer } from "../Authentication/Reducers/AuthenticationReducer";
import { NameReducer } from "./Reducers/RegisterUserReducer";

export const UseRegisterUserViewModel = () => {
    const [loading, setLoading] = useState(false);
    const [ErroRequest, SetErroRequest] = useState(null);
    const [EmailState, EmailDispatch] = useReducer(EmailReducer, { email: "", error: null });
    const [PasswordState, PasswordDispatch] = useReducer(PasswordReducer, { password: "", error: null });
    const [NameState, NameDispatch] = useReducer(NameReducer, { name: "", error: "" })

    return {
        name: NameState.name,
        nameError: NameState.error,
        setName: (name: string) => NameDispatch({ type: "SET_NAME", payload: name }),

        email: EmailState.email,
        emailError: EmailState.error,
        setEmail: (email: string) => EmailDispatch({ type: "SET_EMAIL", payload: email }),

        password: PasswordState.password,
        passwordError: PasswordState.error,
        setPassword: (password: string) => PasswordDispatch({ type: "SET_PASSWORD", payload: password }),

        loading,
        setLoading,

        errorResponse: ErroRequest,

        register: async () => {
            const response = await RegisterUserModel.CreateSystem({
                email: EmailState.email,
                password: PasswordState.password,
                name: NameState.name
            })

            if(!get(response,'status',stubTrue())){
                SetErroRequest(get(response,'detail',null));
                return;
            }

            return response
        }
    }
}