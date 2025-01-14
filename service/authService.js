import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export async function signup(formData){
    try{
        const response = await axios.post(`${BACKEND_URL}/api/signup`, formData);
        return response.data;
    }catch(err){
        return {error: err.response?.data?.error || 'An unknown error occurred'};
    }

}

export async function login(formData){
    try{
        const response = await axios.post(`${BACKEND_URL}/api/login`, formData);
        return response.data;
    }catch(err){
        return {error: err.response?.data?.error || 'An unknown error occurred'};
    }

}