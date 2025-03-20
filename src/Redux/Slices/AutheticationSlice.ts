import { LocalStoregeKeys } from "@/shared/Constants/LocalStoreage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get } from "lodash";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
    userId: string;
    nameUser: string;
}

const InitalState: AuthState = {
    token: null,
    isAuthenticated: false,
    error: null,
    userId: '',
    nameUser: ''
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
        nameUser: getValueLocalStorage(LocalStoregeKeys.NAMEUSER)
    },
    reducers: {
        login: (state, action: PayloadAction<{ token: string, userId: string } | null>) => {
            if (action.payload) {
                state.token = get(action.payload, 'token', null);
                state.userId = get(action.payload, 'userId', '');
                state.isAuthenticated = true;
                state.nameUser = get(action.payload, 'name', '');

                if (typeof window !== "undefined") {
                    localStorage.setItem(LocalStoregeKeys.TOKEN, get(action.payload, 'token', null) as string);
                    localStorage.setItem(LocalStoregeKeys.USERID, get(action.payload, 'userId', null) as string);
                    localStorage.setItem(LocalStoregeKeys.NAMEUSER, get(action.payload, 'name', '') as string);
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
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
});

export const { login, logout, setError } = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer;
