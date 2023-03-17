import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {definitions} from '../types/database'
import {productFilters} from "./productsSlice";

// Define a service using a base URL and expected endpoints
export const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `/api/`,
        prepareHeaders: (headers, {getState}) => {
            headers.set("Content-Type", "application/json");
            headers.set("Prefer", "return=representation")
            return headers;
        }
    }),
    tagTypes: ['Items', "ItemsPriceRange"],
    endpoints: (builder) => ({
        getAllItems: builder.query<(definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] })[], productFilters>({
            query: ({...props}) => {
                let query = "products?"

                if (props.name) query += "name=" + props.name + "&"
                if (props.max_price) query += "max_price=" + props.max_price + "&"
                if (props.min_price) query += "min_price=" + props.min_price + "&"

                // if ids override

                if (props.ids) query = 'products?ids=' + props.ids + "&"

                if (props.categories) query += "categories=" + props.categories + "&"
                if (props.limit) query += "limit=" + props.limit

                // console.log(query)

                return query
            },
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Items' as const, id})),
                        {type: 'Items', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Items', id: 'LIST'}]
            },
        }),

        getAllItemsPriceRange: builder.query<number[], productFilters>({
            query: ({...props}) => {
                let query = "price_range?"

                if (props.name) query += "name=" + props.name + "&"
                if (props.categories) query += "categories=" + props.categories + "&"
                if (props.max_price) query += "max_price=" + props.max_price + "&"
                if (props.min_price) query += "min_price=" + props.min_price

                return query
            },
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map((value) => ({type: 'ItemsPriceRange' as const, value})),
                        {type: 'ItemsPriceRange', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'ItemsPriceRange', id: 'LIST'}]
            },
        }),
    })
})

export const {
    useGetAllItemsQuery,
    useGetAllItemsPriceRangeQuery
} = itemsApi
