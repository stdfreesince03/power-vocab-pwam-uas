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

export async function updateCardService(token, updatedCard) {
    try {
        console.log("Sending Data to API:", JSON.stringify(updatedCard, null, 2));

        const response = await apiClient.put(`/api/cards/${updatedCard.id}`, updatedCard, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Received API Response:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (err) {
        console.log("API Error:", err.response?.data || err.message);
        return { error: err.response?.data?.error || "An unknown error occurred" };
    }
}

export async function updateProgressService(token, cardId, wordPairs) {
    try {

        const response = await apiClient.put(`/api/cards/${cardId}/progress`,
            {
                wordPairs: wordPairs.map(pair => ({
                    english: pair.english,
                    indonesian: pair.indonesian,
                    is_learned: pair.isLearned
                }))
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Progress Update Response:', response.data); // For debugging
        return response.data;
    } catch (err) {
        console.error('Progress Update Error:', err.response?.data || err);
        return { error: err.response?.data?.error || "An unknown error occurred" };
    }
}