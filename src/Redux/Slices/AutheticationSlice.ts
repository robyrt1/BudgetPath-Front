import { LocalStoregeKeys } from "@/shared/Constants/LocalStoreage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    error: string | null;
}

const InitalState: AuthState = {
    token: null,
    isAuthenticated: false,
    error: null
};

const getTokenFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return window.localStorage.getItem(LocalStoregeKeys.TOKEN);
    }
    return null;
};

const AuthenticationSlice = createSlice({
    name: "auth",
    initialState: {
        ...InitalState,
        token: getTokenFromLocalStorage(),
    },
    reducers: {
        login: (state, action: PayloadAction<string | null>) => {
            if (action.payload) {
                state.token = action.payload;
                state.isAuthenticated = true;
                if (typeof window !== "undefined") {
                    localStorage.setItem(LocalStoregeKeys.TOKEN, action.payload);
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
