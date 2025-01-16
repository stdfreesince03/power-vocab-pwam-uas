import { create } from 'zustand';
import {createCard, deleteCard, getCards} from '../service/cardService';

const useCardStore = create((set) => ({
    cards: [],
    chosenCard: null,  
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
                cards: [...state.cards, createdCard],
            }));
        } catch (err) {
            set({ error: 'Failed to add card' });
        } finally {
            set({ isLoading: false });
        }
    },

    deleteCard: async (token, cardId) => {
        set({ isLoading: true, error: null });

        try {
            const result = await deleteCard(token, cardId);
            if (result.error) {
                set({ error: result.error });
                return;
            }

            set((state) => ({
                cards: state.cards.filter(card => card.id !== cardId),
            }));
        } catch (err) {
            set({ error: 'Failed to delete card' });
        } finally {
            set({ isLoading: false });
        }
    },

    setChosenCard: (card) => set({ chosenCard: card }),

}));

export default useCardStore;