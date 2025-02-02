'use client';

import AuthenticationModel from "@/Models/Authentication/AuthenticationModel";
import { get, stubTrue } from "lodash";
import { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { login, setError } from "./../../Redux/Slices/AutheticationSlice";
import { EmailReducer, PasswordReducer } from "./Reducers/AuthenticationReducer";
import { IAuthenticationState } from "./Type/AuthenticationType";

const UseAuthenticationViewModel = (): IAuthenticationState => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorSign , SetErrorSign] = useState(null);

    const [EmailState, EmailDispatch] = useReducer(EmailReducer, { email: "", error: null });
    const [PasswordState, PasswordDispatch] = useReducer(PasswordReducer, { password: "", error: null });

    return {
        email: EmailState.email,
        emailError: EmailState.error,
        setEmail: (email: string) => EmailDispatch({ type: "SET_EMAIL", payload: email }),

        password: PasswordState.password,
        passwordError: PasswordState.error,
        setPassword: (password: string) => PasswordDispatch({ type: "SET_PASSWORD", payload: password }),

        errorSign: errorSign,
        signUp: async () => {
            SetErrorSign(null);
            setLoading(true)

            const response = await AuthenticationModel.LoginUser({ email: EmailState.email, password: PasswordState.password })
            setLoading(false)
            if(!get(response,'status',stubTrue())){
                const message = get(response,'detail',null)
                dispatch(setError(message));
                SetErrorSign(message);
            }

            dispatch(login(get(response,'token','')));
            return response;
        },

        loading,
        setLoading,
    }
}

export default UseAuthenticationViewModel;