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


export async function deleteCardService(token, cardId) {
    try {
        const response = await apiClient.delete(`/api/cards/${cardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        return { error: err.response?.data?.error || "An unknown error occurred" };
    }
}

export async function updateCardService(token,updatedCard) {
    try {
        const response = await apiClient.put(`/api/cards/${updatedCard.id}`, updatedCard,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        return { error: err.response?.data?.error || "An unknown error occurred" };
    }
}

export async function updateProgressService(token, cardId, wordPairs) {
    try {
        const response = await apiClient.put(`/api/cards/${cardId}/progress`,
            { wordPairs },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (err) {
        return { error: err.response?.data?.error || "An unknown error occurred" };
    }
}
