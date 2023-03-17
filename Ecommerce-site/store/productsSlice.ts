import {createSlice} from "@reduxjs/toolkit";
import {definitions} from "../types/database";

// filters type
export interface productFilters {
    name: string;
    categories: string[];
    min_price?: string;
    max_price?: string;
    limit?: string;
    ids?: string[]
}

export interface SemanticSearchInterface {
    searchString: string;
}

// Actual Slice
export const productsSlice = createSlice({
    name: "productFilters",
    initialState: {
        semanticSearch: {
            searchString: ""
        },
        filters: {
            categories: [],
            ids: [],
            name: "",
            max_price: "",
            min_price: "",
            limit: "12"
        } as productFilters
    },
    reducers: {

        // Actions to set filters
        setProductFiltersCategoriesState(state, action) {
            state.filters.categories = action.payload;
        },

        setProductFiltersIdsState(state, action) {
            state.filters.ids = action.payload;
        },

        setProductFiltersNameState(state, action) {
            state.filters.name = action.payload;
        },

        setProductFiltersMaxPriceState(state, action) {
            state.filters.max_price = action.payload;
        },

        setProductFiltersMinPriceState(state, action) {
            state.filters.min_price = action.payload;
        },

        setProductFiltersLimitState(state, action) {
            state.filters.limit = action.payload;
        },

        setSemanticSearchStringState(state, action) {
            state.semanticSearch.searchString = action.payload;
        },

    },

});

export const {
    setProductFiltersCategoriesState,
    setProductFiltersMaxPriceState,
    setProductFiltersMinPriceState,
    setProductFiltersNameState,
    setProductFiltersLimitState,
    setSemanticSearchStringState,
    setProductFiltersIdsState
} = productsSlice.actions;

