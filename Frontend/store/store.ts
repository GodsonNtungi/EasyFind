import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {itemsApi} from "../services/items";
import {storeApi} from "../services/store";
import {authSlice} from "./authSlice";

const makeStore = () => {
    return configureStore({
        reducer: {
            [authSlice.name]: authSlice.reducer,
            [itemsApi.reducerPath]: itemsApi.reducer,
            [storeApi.reducerPath]: storeApi.reducer,
        },
        devTools: true,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(itemsApi.middleware)
                .concat(storeApi.middleware)

    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const wrapper = createWrapper<AppStore>(makeStore);
export const store = makeStore()

