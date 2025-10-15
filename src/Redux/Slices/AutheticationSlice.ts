import { LocalStoregeKeys } from "@/shared/Constants/LocalStoreage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { get } from "lodash";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
    userId: string;
    nameUser: string;
    email?: string
}

const InitalState: AuthState = {
    token: null,
    isAuthenticated: false,
    error: null,
    userId: '',
    nameUser: '',
    email: ''
};

const getValueLocalStorage = (key: string) => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(key);
    }
    return null;
}
const AuthenticationSlice = createSlice({
    name: "auth",
    initialState: {
        ...InitalState,
        token: getValueLocalStorage(LocalStoregeKeys.TOKEN),
        userId: getValueLocalStorage(LocalStoregeKeys.USERID),
        nameUser: getValueLocalStorage(LocalStoregeKeys.NAMEUSER),
        email: getValueLocalStorage(LocalStoregeKeys.EMAIL),
    },
    reducers: {
        login: (state, action: PayloadAction<{ token: string, userId: string } | null>) => {
            if (action.payload) {
                state.token = get(action.payload, 'token', null);
                state.userId = get(action.payload, 'userId', '');
                state.isAuthenticated = true;
                state.nameUser = get(action.payload, 'name', '');
                state.email = get(action.payload, 'email', '');

                const cookieOptions = { expires: 7, secure: true, sameSite: 'Lax' as const }; // Expira em 7 dias


                if (typeof window !== "undefined") {
                    const token = get(action.payload, 'token', null) as string;
                    const userId = get(action.payload, 'userId', null) as string;
                    const nameUser = get(action.payload, 'name', '') as string;
                    const email = get(action.payload, 'email', '') as string;
                    localStorage.setItem(LocalStoregeKeys.TOKEN, get(action.payload, 'token', null) as string);
                    localStorage.setItem(LocalStoregeKeys.USERID, get(action.payload, 'userId', null) as string);
                    localStorage.setItem(LocalStoregeKeys.NAMEUSER, get(action.payload, 'name', '') as string);
                    localStorage.setItem(LocalStoregeKeys.EMAIL, get(action.payload, 'email', '') as string);
                    if (token) Cookies.set(LocalStoregeKeys.TOKEN, token, cookieOptions);
                    if (userId) Cookies.set(LocalStoregeKeys.USERID, userId, cookieOptions);
                    if (nameUser) Cookies.set(LocalStoregeKeys.NAMEUSER, nameUser, cookieOptions);
                    if (email) Cookies.set(LocalStoregeKeys.EMAIL, email, cookieOptions);
                } state.error = null;
            } else {
                state.error = "Falha no login. Verifique suas credenciais.";
                state.isAuthenticated = false;
            }
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem(LocalStoregeKeys.TOKEN);
            Cookies.remove(LocalStoregeKeys.TOKEN);
            Cookies.remove(LocalStoregeKeys.USERID);
            Cookies.remove(LocalStoregeKeys.NAMEUSER);
            Cookies.remove(LocalStoregeKeys.EMAIL);
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const { login, logout, setError } = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;
