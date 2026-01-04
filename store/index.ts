// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem('cart');
    const parsed = stateStr ? JSON.parse(stateStr) : undefined;
    return parsed && parsed.itens ? parsed : { itens: [] };
  } catch (e) {
    return { itens: [] };
  }
};

const saveToLocalStorage = (state: any) => {
  try {
    const serialized = JSON.stringify(state.cart); // Salva apenas o reducer "cart"
    localStorage.setItem('cart', serialized);
  } catch (e) {
    // erro silencioso
  }
};

const preloadedCart = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: preloadedCart || { itens: [] },
  },
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
