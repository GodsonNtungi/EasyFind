import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {definitions} from "../types/database";
import {useGetAllUserStoresQuery} from "../services/store";


export interface CartItem {
    id: number
    name: string
    count: number
    price: number
    image: string
    store_id: number
}

export interface UserProfile {
    employee: definitions["employees"] | undefined
    owner: definitions["profiles"] | undefined
}


// Actual Slice
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        currentStore: {} as definitions["stores"],
        businessProfile: {} as definitions["profiles"],
        currentCustomer: {} as definitions["customers"],
        cartState: [] as CartItem[],
        layout: {
            cartOpened: false ,
            stockItemsArrangement: "blocks",
            productLimit: 12
        },
        profile: {} as UserProfile
    },
    reducers: {

        // Action to set the current store
        setCurrentStore(state, action) {
            state.currentStore = action.payload;
        },

        // Action to set the current customer
        setCurrentCustomer(state, action) {
            state.currentCustomer = action.payload;
        },

        // Action to set the current customer
        setBusinessProfile(state, action) {
            state.businessProfile = action.payload;
        },

        // Action to set current profile
        setCurrentProfile(state, action) {
            state.profile = action.payload
        },

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
                            x.count += 1
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

        // Actions to set layout
        setStockItemsArrangement(state, action) {
            state.layout.stockItemsArrangement = action.payload;
        },

        // Actions to set layout
        setProductLimit(state, action) {
            state.layout.productLimit = action.payload;
        },
    },

    extraReducers: {

    }

});

export const {
    setCartOpened,
    setCurrentStore,
    setCartState,
    editItem,
    addItem,
    removeItem,
    setCurrentCustomer,
    setCurrentProfile,
    setBusinessProfile,
    setStockItemsArrangement,
    setProductLimit
} = authSlice.actions;

