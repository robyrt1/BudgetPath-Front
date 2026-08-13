'use client';

import AuthenticationModel from "@/Models/Authentication/AuthenticationModel";
import { get, stubTrue } from "lodash";
import { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { login, setError } from "./../../Redux/Slices/AutheticationSlice";
import { EmailReducer, PasswordReducer } from "./Reducers/AuthenticationReducer";
import { IAuthenticationState } from "./Type/AuthenticationType";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/libs/firebase";
import RegisterUserModel from "@/Models/RegisterUser/RegisterUserModel";

const UseAuthenticationViewModel = (): IAuthenticationState => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [errorSign, SetErrorSign] = useState(null);

    const [EmailState, EmailDispatch] = useReducer(EmailReducer, { email: "", error: null });
    const [PasswordState, PasswordDispatch] = useReducer(PasswordReducer, { password: "", error: null });

    return {
        email: EmailState.email,
        emailError: EmailState.error,
        setEmail: (email: string) => EmailDispatch({ type: "SET_EMAIL", payload: email }),

        password: PasswordState.password,
        passwordError: PasswordState.error,
        setPassword: (password: string) => PasswordDispatch({ type: "SET_PASSWORD_SIGN_IN", payload: password }),

        errorSign: errorSign,
        signIn: async () => {
            SetErrorSign(null);
            setLoading(true)

            const response = await AuthenticationModel.LoginUser({ email: EmailState.email, password: PasswordState.password })
            setLoading(false)
            if (!get(response, 'status', stubTrue())) {
                const message = get(response, 'details', null)
                dispatch(setError(message as string));
                SetErrorSign(message as any);
            }

            dispatch(login(response.details as any));
            return response;

        },

        signInWithGoogle: async () => {
            SetErrorSign(null);
            setLoading(true);
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const idToken = await result.user.getIdToken();
                const displayName = result.user.displayName || "";
                const email = result.user.email || "";

                // 1. Tenta fazer login com o token do Firebase
                let response = await AuthenticationModel.LoginUser({ email: "", password: "", firebaseUid: idToken });
                
                // Se falhar (ex: usuário não cadastrado), tenta cadastrar
                if (response.status === false) {
                    const registerRes = await RegisterUserModel.CreateFirebase({
                        name: displayName,
                        email: email,
                        idToken: idToken
                    });
                    
                    if (registerRes.status === false) {
                        throw new Error(registerRes.detail || "Falha ao registrar usuário com Google");
                    }
                    
                    // Tenta fazer login novamente após registrar
                    response = await AuthenticationModel.LoginUser({ email: "", password: "", firebaseUid: idToken });
                }

                setLoading(false);
                
                if (!get(response, 'status', stubTrue())) {
                    const message = get(response, 'details', null);
                    dispatch(setError(message as string));
                    SetErrorSign(message as any);
                    return null;
                }

                dispatch(login(response.details as any));
                return response;
            } catch (err: any) {
                setLoading(false);
                const message = err.message || "Erro ao autenticar com Google";
                dispatch(setError(message as string));
                SetErrorSign(message as any);
                return null;
            }
        },

        loading,
        setLoading,
    }
}

export default UseAuthenticationViewModel;