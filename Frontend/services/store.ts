import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {definitions} from '../types/database'

// Define a service using a base URL and expected endpoints
export const storeApi = createApi({
    reducerPath: 'storeApi',
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
    tagTypes: ['Stores', 'Website', 'Profile', 'Employees', 'Customers'],
    endpoints: (builder) => ({
        getAllUserStores: builder.query<(definitions['stores'] & { profiles: definitions['profiles']})[], Partial<definitions["stores"]>>({
            query: ({profile_id}) => `stores?profile_id=eq.${profile_id}&select=*,profiles(*)`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Stores' as const, id})),
                        {type: 'Stores', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Stores', id: 'LIST'}]
            },
        }),
        addStore: builder.mutation<definitions['stores'], Partial<definitions['stores']>>({
            query: (body) => ({
                url: 'stores',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Stores', id: 'LIST' }],
        }),
        getProfileDefaultStore: builder.query<(definitions['stores'] & {profiles: definitions['profiles']})[], Partial<definitions['stores']>>({
            query: ({profile_id, is_default}) => {
                return is_default?`stores?profile_id=eq.${profile_id}&is_default=eq.${is_default}&select=*,profiles(*)`:`stores?profile_id=eq.${profile_id}&select=*,profiles(*)`
            },
            providesTags: (result, error, {id}) => [{ type: 'Stores', id }],
        }),
        getStoreById: builder.query<(definitions['stores'] & {profiles: definitions['profiles']})[], Partial<definitions['stores']>>({
            query: ({id}) => {
                return `stores?id=eq.${id}&select=*,profiles(*)`
            },
            providesTags: (result, error, {id}) => [{ type: 'Stores', id }],
        }),
        editStore: builder.mutation<definitions['stores'], Partial<definitions['stores']>>({
            query: (data) => {
                const { id, ...body } = data
                // console.log(data)
                return {
                    url: `store?id=eq.${id}`,
                    method: 'PATCH',
                    body,
                }},
            invalidatesTags: [{ type: 'Stores', id: 'LIST' }],
        }),
        deleteStore: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `stores?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{ type: 'Stores', id: 'LIST' }],
        }),


        // user profile
        getUserProfile: builder.query<definitions['profiles'][], Partial<definitions['profiles']>>({
            query: ({user_id}) => `profiles?user_id=eq.${user_id}&select=*`,
            providesTags: (result, err, {user_id}) => [{type: 'Profile', user_id}],
        }),

        editUserProfile: builder.mutation<definitions['profiles'], Partial<definitions['profiles']>>({
            query: (data) => {
                const { user_id, ...body } = data
                // console.log(data)
                return {
                    url: `profiles?user_id=eq.${user_id}`,
                    method: 'PATCH',
                    body,
                }},
            invalidatesTags: (results, err, {user_id}) => [{ type: 'Profile', user_id }],
        }),
        addProfile: builder.mutation<definitions['profiles'], Partial<definitions['profiles']>>({
            query: (body) => ({
                url: 'profiles',
                method: 'POST',
                body,
            }),
            invalidatesTags: (results, err, {user_id}) => [{ type: 'Profile', user_id }],
        }),

        // employees out
        getAllStoreEmployees: builder.query<definitions['employees'][], Partial<definitions['employees']>>({
            query: ({store_id}) => `employees?store_id=eq.${store_id}&select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Employees' as const, id})),
                        {type: 'Employees', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Employees', id: 'LIST'}]
            },
        }),
        getStoreEmployeeByPin: builder.query<definitions['employees'][], Partial<definitions['employees']>>({
            query: ({store_id, pin}) => `employees?store_id=eq.${store_id}&pin=eq.${pin}&select=*`,
            providesTags: (result, error, {id}) => [{ type: 'Employees', id }],
        }),
        addEmployee: builder.mutation<definitions['employees'], Partial<definitions['employees']>>({
            query: (body) => ({
                url: 'employees',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Employees', id: 'LIST' }],
        }),
        editEmployee: builder.mutation<definitions['employees'], Partial<definitions['employees']>>({
            query: (body) => ({
                url: `employees?id=eq.${body.id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Employees', id: 'LIST' }],
        }),
        deleteEmployee: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `employees?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{ type: 'Employees', id: 'LIST' }],
        }),

        // employees out
        getAllStoreCustomers: builder.query<definitions['customers'][], Partial<definitions['customers']>>({
            query: ({store_id}) => `customers?store_id=eq.${store_id}&select=*`,
            providesTags: (result) => {
                // is result available?
                return result
                    ? // successful query
                    [
                        ...result.map(({id}) => ({type: 'Customers' as const, id})),
                        {type: 'Customers', id: 'LIST'},
                    ]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                    [{type: 'Customers', id: 'LIST'}]
            },
        }),
        addCustomer: builder.mutation<definitions['customers'], Partial<definitions['customers']>>({
            query: (body) => ({
                url: 'customers',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
        }),
        deleteCustomer: builder.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `customers?id=eq.${id}`,
                    method: 'DELETE',
                }
            },
            // Invalidates all queries that subscribe to this Post `id` only.
            invalidatesTags: [{ type: 'Customers', id: 'LIST' }],
        }),

        // Websites
        getWebsite: builder.query<definitions['websites'][], Partial<definitions['websites']>>({
            query: ({profile_id}) => `websites?profile_id=eq.${profile_id}&select=*`,
            providesTags: (result, err, {id}) => [{type: 'Website', id}],
        }),
        addWebsite: builder.mutation<definitions['websites'][], Partial<definitions['websites']>>({
            query: (body) => ({
                url: `websites`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, err, {id}) => [{type: 'Website', id}],
        }),
        editWebsite: builder.mutation<definitions['websites'][], Partial<definitions['websites']>>({
            query: (body) => ({
                url: `websites?id=eq.${body.id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: (result, err, {id}) => [{type: 'Website', id}],
        }),

    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useAddEmployeeMutation,
    useAddStoreMutation,
    useEditStoreMutation,
    useEditUserProfileMutation,
    useGetAllStoreEmployeesQuery,
    useGetAllUserStoresQuery,
    useGetStoreByIdQuery,
    useGetProfileDefaultStoreQuery,
    useGetUserProfileQuery,
    useAddCustomerMutation,
    useDeleteCustomerMutation,
    useGetAllStoreCustomersQuery,
    useDeleteEmployeeMutation,
    useGetStoreEmployeeByPinQuery,
    useAddProfileMutation,
    useGetWebsiteQuery,
    useEditWebsiteMutation,
    useAddWebsiteMutation
} = storeApi

