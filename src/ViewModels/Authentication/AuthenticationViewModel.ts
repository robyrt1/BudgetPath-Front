'use client';

import AuthenticationModel from "@/Models/Authentication/AuthenticationModel";
import { useReducer, useState } from "react";
import { EmailReducer, PasswordReducer } from "./Reducers/AuthenticationReducer";
import { IAuthenticationState } from "./Type/AuthenticationType";

const UseAuthenticationViewModel = (): IAuthenticationState => {
    const [loading, setLoading] = useState(false);

    const [EmailState, EmailDispatch] = useReducer(EmailReducer, { email: "", error: null });
    const [PasswordState, PasswordDispatch] = useReducer(PasswordReducer, { password: "", error: null });

    return {
        email: EmailState.email,
        emailError: EmailState.error,
        setEmail: (email: string) => EmailDispatch({ type: "SET_EMAIL", payload: email }),

        password: PasswordState.password,
        passwordError: PasswordState.error,
        setPassword: (password: string) => PasswordDispatch({ type: "SET_PASSWORD", payload: password }),

        signUp: async () => {
            setLoading(true)

            const {status,detail, ...response} = await AuthenticationModel.LoginUser({ email: EmailState.email, password: PasswordState.password })

            if(!status) {
                console.log('response error >>>>>',detail)
            }

            setLoading(false)
            return response;
        },

        loading,
        setLoading,
    }
}

export default UseAuthenticationViewModel;