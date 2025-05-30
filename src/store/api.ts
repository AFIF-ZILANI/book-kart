import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const apis = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/',
        credentials: 'include',

    }),
    tagTypes: ['User'],
    endpoints: (build) => ({
        
    }),
})