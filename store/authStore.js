import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set) => ({
    token: null,
    isAuthenticated: false,
    error: null,

    setToken: async (token) => {
        try {
            await SecureStore.setItemAsync('authToken', token);
            set({ token, isAuthenticated: true, error: null });
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    removeToken: async () => {
        try {
            await SecureStore.deleteItemAsync('authToken');
            set({ token: null, isAuthenticated: false, error: null });
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    initialize: async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            set({ token, isAuthenticated: !!token, error: null });
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },
}));

export default useAuthStore;