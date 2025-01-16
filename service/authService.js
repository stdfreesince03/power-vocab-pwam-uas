import apiClient from "../config/axios";


export async function signup(formData){
    try{
        const response = await apiClient.post(`/api/signup`, formData);
        return response.data;
    }catch(err){
        return {error: err.response?.data?.error || 'An unknown error occurred'};
    }

}

export async function login(formData){
    try{
        const response = await apiClient.post(`/api/login`, formData);
        return response.data;
    }catch(err){
        console.error("Login error:", err.response?.data || err.message);
        return {error: err.response?.data?.error || 'An unknown error occurred'};
    }

}