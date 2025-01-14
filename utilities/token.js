import * as SecureStore from 'expo-secure-store';

export async function storeToken(token) {
    try {
        await SecureStore.setItemAsync('authToken', token);
    } catch (error) {
        console.error('Error storing token:', error);
    }
}

export async function getToken() {
    try {
        return await SecureStore.getItemAsync('authToken');
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
}