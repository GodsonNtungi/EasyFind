import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {cartSlice} from "./cartSlice";
import {itemsApi} from "./productsApi";
import {productsSlice} from "./productsSlice";

const makeStore = () => {
    return configureStore({
        reducer: {
            [cartSlice.name]: cartSlice.reducer,
            [productsSlice.name]: productsSlice.reducer,
            [itemsApi.reducerPath]: itemsApi.reducer,
        },
        devTools: true,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(itemsApi.middleware)

    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const wrapper = createWrapper<AppStore>(makeStore);
export const store = makeStore()

