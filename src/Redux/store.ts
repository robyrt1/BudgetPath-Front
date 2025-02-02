import { configureStore } from "@reduxjs/toolkit";
import AuthenticationSlice from './Slices/AutheticationSlice';

export const store = configureStore({
    reducer: {
        auth: AuthenticationSlice
    }
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;