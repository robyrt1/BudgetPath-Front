import { LocalStoregeKeys } from "@/shared/Constants/LocalStoreage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { get } from "lodash";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
    userId: string;
}

const InitalState: AuthState = {
    token: null,
    isAuthenticated: false,
    error: null,
    userId: ''
};

const getTokenFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(LocalStoregeKeys.TOKEN);
    }
    return null;
};

const getUserIdFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(LocalStoregeKeys.USERID);
    }
    return null;
};

const AuthenticationSlice = createSlice({
    name: "auth",
    initialState: {
        ...InitalState,
        token: getTokenFromLocalStorage(),
        userId: getUserIdFromLocalStorage()
    },
    reducers: {
        login: (state, action: PayloadAction<{ token: string, userId: string } | null>) => {
            console.log('action.payload >>>', action.payload)
            if (action.payload) {
                state.token = get(action.payload, 'token', null);
                state.userId = get(action.payload, 'userId', '');
                state.isAuthenticated = true;
                if (typeof window !== "undefined") {
                    localStorage.setItem(LocalStoregeKeys.TOKEN, get(action.payload, 'token', null) as string);
                    localStorage.setItem(LocalStoregeKeys.USERID, get(action.payload, 'userId', null) as string);

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
