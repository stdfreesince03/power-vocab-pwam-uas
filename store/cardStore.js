import { create } from 'zustand';
import { getCards } from '../service/cardService';

const useCardStore = create((set) => ({
    cards: [],
    isLoading: false,
    error: null,

    fetchCards: async (token) => {
        set({ isLoading: true, error: null });
        try {
            const data = await getCards(token);
            if (data.error) {
                set({ error: data.error });
            } else {
                set({ cards: data });
            }
        } catch (err) {
            set({ error: 'Failed to fetch cards' });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useCardStore;