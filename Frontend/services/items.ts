import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {definitions} from '../types/database'

// Define a service using a base URL and expected endpoints
export const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`,
        prepareHeaders: (headers, {getState}) => {
            headers.set('apikey', `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
            headers.set('authorization', `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
            headers.set("Content-Type", "application/json");
            headers.set("Prefer", "return=representation")
            return headers;
        }
    }),
    tagTypes: ['Items', 'Categories', 'Transactions', 'ItemsIn', 'ItemsOut', 'Orders', 'Units'],
    endpoints: (builder) => ({
        getAllItems: builder.query<(definitions['items'] & { item_images: definitions['item_images'][], categories: definitions['categories'] })[], Partial<definitions['items']> & { limit?: any }>({
            query: ({
                        store_id,
                        name,
                        category,
                        limit
                    }) => {
                let queryString = name ? `items?store_id=eq.${store_id}&name=fts.${name}&select=*,categories(id, name),stores(id, name),item_images(*)` : `items?store_id=eq.${store_id}&select=*,categories(id, name),stores(id, name),item_images(*)`

                if (category) {
                    queryString = name ? `items?store_id=eq.${store_id}&name=fts.${name}&category=eq.${category}&select=*,categories(id, name),stores(id, name),item_images(*)` : `items?store_id=eq.${store_id}&category=eq.${category}&select=*,categories(id, name),stores(id, name),item_images(*)`
                }
                if (limit) {
                    queryString += "&limit=" + limit
                }
                return queryString
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
        addItem: builder.mutation<definitions['items'], Partial<definitions['items']>>({
            query: (body) => ({
                url: 'items',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Items', id: 'LIST'}],
        }),
        getItem: builder.query<definitions['items'], number>({
            query: (id) => `items?id=eq.${id}`,
            providesTags: (result, error, id) => [{type: 'Items', id}],
        }),
        editItem: builder.mutation<definitions['items'], Partial<definitions['items']>>({
            query: (data) => {
                const {id, ...body} = data
                // console.log(data)
                return {
                    url: `items?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'Items', id: 'LIST'}],
        }),
        deleteItem: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `items?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Items', id: 'LIST'}],
        }),

        // item images
        addItemImage: builder.mutation<definitions['item_images'], Partial<definitions['item_images']>>({
            query: (body) => {
                return {
                    url: 'item_images',
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: [{type: 'Items', id: 'LIST'}],
        }),
        deleteItemImage: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `item_images?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Items', id: 'LIST'}],
        }),

        // groups
        getAllCategories: builder.query<definitions['categories'][], Partial<definitions['categories']>>({
            query: ({
                        store_id,
                        name
                    }) => name ? `categories?store_id=eq.${store_id}&name=fts.${name}&select=*,stores(id, name)` : `categories?store_id=eq.${store_id}&select=*,stores(id, name)`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Categories' as const, id})),
                        {type: 'Categories', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Categories', id: 'LIST'}]
            },
        }),
        addCategory: builder.mutation<definitions['categories'], Partial<definitions['categories']>>({
            query: (body) => ({
                url: 'categories',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Categories', id: 'LIST'}],
        }),
        editCategory: builder.mutation<definitions['categories'], Partial<definitions['categories']>>({
            query: (data) => {
                const {id, ...body} = data
                // console.log(data)
                return {
                    url: `categories?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'Categories', id: 'LIST'}],
        }),
        deleteCategory: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `categories?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Categories', id: 'LIST'}],
        }),


        // groups
        getAllUnits: builder.query<definitions['units'][], Partial<definitions['units']>>({
            query: ({
                        store_id,
                        name
                    }) => name ? `units?store_id=eq.${store_id}&name=fts.${name}&select=*,stores(id, name)` : `units?store_id=eq.${store_id}&select=*,stores(id, name)`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Units' as const, id})),
                        {type: 'Units', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Units', id: 'LIST'}]
            },
        }),
        addUnit: builder.mutation<definitions['units'], Partial<definitions['units']>>({
            query: (body) => ({
                url: 'units',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Units', id: 'LIST'}],
        }),
        editUnit: builder.mutation<definitions['units'], Partial<definitions['units']>>({
            query: (data) => {
                const {id, ...body} = data
                // console.log(data)
                return {
                    url: `units?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'Units', id: 'LIST'}],
        }),
        deleteUnit: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `units?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Units', id: 'LIST'}],
        }),


        // transactions
        getAllTransaction: builder.query<(definitions['transactions'] & { items_out: (definitions['items_out'] & { items: (definitions['items'] & { item_images: definitions['item_images'][] }) })[], customers: definitions["customers"] })[], { from: string, to: string, store_id: number } | undefined>({
            query: (filter) => filter ? `transactions?store_id=eq.${filter.store_id}&created_at=gt.${filter.from}&created_at=lt.${filter.to}&select=*,items_out(*, items(id, name, item_images(*))),customers(id, unique_name, first_name, last_name)` : `transactions?select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Transactions' as const, id})),
                        {type: 'Transactions', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Transactions', id: 'LIST'}]
            },
        }),
        addTransaction: builder.mutation<definitions['transactions'], Partial<definitions['transactions']>>({
            query: (body) => ({
                url: 'transactions',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Transactions', id: 'LIST'}],
        }),
        editTransaction: builder.mutation<definitions['transactions'], Partial<definitions['transactions']>>({
            query: (data) => {
                const {id, ...body} = data
                // console.log(data)
                return {
                    url: `transactions?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'Transactions', id: 'LIST'}],
        }),
        deleteTransaction: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `transactions?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Transactions', id: 'LIST'}],
        }),

        // transactions
        getAllOrders: builder.query<(definitions['orders'] & { order_items: (definitions["order_items"] & { items: (definitions['items'] & { item_images: definitions['item_images'][] }) })[] })[], { from: string, to: string, store_id: number } | undefined>({
            query: (filter) => filter ? `orders?store_id=eq.${filter.store_id}&created_at=gt.${filter.from}&created_at=lt.${filter.to}&select=*,order_items(*, items(*, item_images(*)))` : `orders?select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Orders' as const, id})),
                        {type: 'Orders', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Orders', id: 'LIST'}]
            },
        }),
        addOrder: builder.mutation<definitions['orders'], Partial<definitions['orders']>>({
            query: (body) => ({
                url: 'orders',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'Orders', id: 'LIST'}],
        }),
        editOrder: builder.mutation<definitions['orders'], Partial<definitions['orders']>>({
            query: (data) => {
                const {id, ...body} = data
                // console.log(data)
                return {
                    url: `orders?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }
            },
            invalidatesTags: [{type: 'Orders', id: 'LIST'}],
        }),
        deleteOrder: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `orders?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{type: 'Orders', id: 'LIST'}],
        }),

        // items in
        getAllItemsIn: builder.query<(definitions['items_in'] & { items: definitions["items"] })[], { from: string, to: string, store_id: number } | undefined>({
            query: (filter) => filter ? `items_in?store_id=eq.${filter.store_id}&date_in=gt.${filter.from}&date_in=lt.${filter.to}&select=*,items(id, name)` : `items_in?select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'ItemsIn' as const, id})),
                        {
                            type: 'ItemsIn',
                            id: 'LIST'
                        },
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'ItemsIn', id: 'LIST'}]
            },
        }),
        addItemIn: builder.mutation<definitions['items_in'], Partial<definitions['items_in']>>({
            query: (body) => ({
                url: 'items_in',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'ItemsIn', id: 'LIST'}, {type: 'Items', id: 'LIST'}],
        }),


        // items out
        getAllItemsOut: builder.query<(definitions['items_out'] & { employees: definitions["employees"], items: definitions["items"] })[], { from: string, to: string, store_id: number } | undefined>({
            query: (filter) => filter ? `items_out?store_id=eq.${filter.store_id}&date_out=gt.${filter.from}&date_out=lt.${filter.to}&select=*,employees(id, name),items(id, name)` : `items_out?select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'ItemsOut' as const, id})),
                        {type: 'ItemsOut', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'ItemsOut', id: 'LIST'}]
            },
        }),
        addItemOut: builder.mutation<definitions['items_out'], Partial<definitions['items_out']>>({
            query: (body) => ({
                url: 'items_out',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{type: 'ItemsOut', id: 'LIST'}, {type: 'Items', id: 'LIST'}],
        }),

    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetAllItemsQuery,
    useAddItemMutation,
    useEditItemMutation,
    useDeleteItemMutation,
    useGetItemQuery,
    useAddItemInMutation,
    useGetAllItemsInQuery,
    useAddItemOutMutation,
    useGetAllItemsOutQuery,
    useGetAllCategoriesQuery,
    useAddCategoryMutation,
    useEditCategoryMutation,
    useDeleteCategoryMutation,
    useGetAllUnitsQuery,
    useAddUnitMutation,
    useAddTransactionMutation,
    useGetAllTransactionQuery,
    useEditTransactionMutation,
    useDeleteTransactionMutation,
    useGetAllOrdersQuery,
    useAddOrderMutation,
    useDeleteOrderMutation,
    useEditOrderMutation,
    useAddItemImageMutation,
    useDeleteItemImageMutation
} = itemsApi