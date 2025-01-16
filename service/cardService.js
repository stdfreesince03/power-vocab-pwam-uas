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

export async function createCard(token, cardData) {
    try {
        const response = await apiClient.post(`/api/cards`, cardData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response.data; // Return the created card data
    } catch (err) {
        return { error: err.response?.data?.error || 'An unknown error occurred' };
    }
}