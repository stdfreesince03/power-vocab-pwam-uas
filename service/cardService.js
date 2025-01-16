import apiClient from "../config/axios";

export async function getCards(token){
    try{
        const response = await apiClient.get(`/api/cards`,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    }catch(err){
        return {error: err.response?.data?.error || 'An unknown error occurred'};
    }
}