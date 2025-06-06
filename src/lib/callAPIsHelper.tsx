import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";

// Base API URL
const API_BASE_URL = "localhost:3000/api/v1"; // Replace with your actual API base URL

    // `${process.env.NEXT_PUBLIC_API_URL}/${process.env.API_VERSION}` ||
    // "http://localhost:3000/api" + "/" + process.env.API_VERSION ||
    // "localhost:3000/api/v1";

// Axios instance
// const axios = axios.create({
//     baseURL: API_BASE_URL,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// Generic GET request helper
export const fetchData = async <T,>(endpoint: string): Promise<T> => {
    const response: AxiosResponse<T> = await axios.get(`/api/v1${endpoint}`);
    return response.data;
};

// Generic POST request helper
export const postData = async <T, U>(endpoint: string, data: U): Promise<T> => {
    const response: AxiosResponse<T> = await axios.post(`/api/v1${endpoint}`, data);
    return response.data;
};

// Generic PUT request helper
export const putData = async <T,>(endpoint: string, data: any): Promise<T> => {
    const response: AxiosResponse<T> = await axios.put(`/api/v1${endpoint}`, data);
    return response.data;
};

// Generic DELETE request helper
export const deleteData = async <T,>(endpoint: string): Promise<T> => {
    const response: AxiosResponse<T> = await axios.delete(`/api/v1${endpoint}`);
    return response.data;
};

// React Query hooks
export const useGetData = <T,>(queryKey: string[], endpoint: string, options = {}) => {
    return useQuery<T, AxiosError>({
        queryKey,
        queryFn: () => fetchData<T>(endpoint),
        ...options,
    });
};

export const usePostData = <T, U>(endpoint: string, options = {}) => {
    return useMutation<T, AxiosError, any>({
        mutationFn: (data) => postData<T, U>(endpoint, data),
        ...options,
    });
};

export const usePutData = <T,>(endpoint: string, options = {}) => {
    return useMutation<T, AxiosError, any>({
        mutationFn: (data) => putData<T>(endpoint, data),
        ...options,
    });
};

export const useDeleteData = <T,>(endpoint: string, options = {}) => {
    return useMutation<T, AxiosError, void>({
        mutationFn: () => deleteData<T>(endpoint),
        ...options,
    });
};

// Request interceptor
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Export axios instance
export { axios };
