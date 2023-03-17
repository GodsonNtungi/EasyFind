import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {createOrder} from "../services/products";
import {definitions} from "../types/database";


export interface CartItem {
    id: number
    name: string
    image: string
    count: number
    price: number,
    store_id: number
}


// Actual Slice
export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartState: [] as CartItem[],
        layout: {
            cartOpened: false ,
        },
    },
    reducers: {

        // Actions to set cart
        setCartState(state, action) {
            state.cartState = action.payload;
        },
        addItem(state, action) {
            try {
                if (!([...state.cartState.map(i => Number(i.id))].indexOf(Number(action.payload.id)) >= 0)) {
                    state.cartState.push(action.payload)
                } else {
                    state.cartState = state.cartState.map(x => {
                        if (x.id === action.payload.id) {
                            x.count += action.payload.count
                        }
                        return x
                    })
                }
            } catch (e) {
                console.log(e)
            }
            return state
        },
        editItem(state, action) {
            // console.log(action)
            state.cartState = state.cartState.map(x => {
                if (x.id === action.payload.id) {
                    x.count = action.payload.count
                }
                return x
            })
            // console.log(state)

        },

        removeItem(state, action) {
            state.cartState = state.cartState.filter(x => x.id !== action.payload.id)
        },

        // Actions to set layout
        setCartOpened(state, action) {
            state.layout.cartOpened = action.payload;
        },

    },

});

export const {
    setCartOpened,
    setCartState,
    editItem,
    addItem,
    removeItem,
} = cartSlice.actions;

