import { create } from 'zustand';
import {createCard, getCards} from '../service/cardService';

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
    addNewCard: async (token, newCard) => {
        set({ isLoading: true, error: null });

        try {
            const createdCard = await createCard(token, newCard);

            if (createdCard.error) {
                set({ error: createdCard.error });
                return;
            }

            set((state) => ({
                cards: [...state.cards, createdCard]
            }));
        } catch (err) {
            set({ error: 'Failed to add card' });
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useCardStore;