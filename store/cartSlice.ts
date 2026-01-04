import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  id: string;
  nome: string;
  images: string;
  quantidade: number;
}

interface CartState {
  itens: Item[];
}

const initialState = {
  itens: [] as Array<{ id: string; quantidade: number }>,
};
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    adicionarItem: (state, action: PayloadAction<Item>) => {
      const existente = state.itens.find(i => i.id === action.payload.id);
      if (existente) {
        existente.quantidade += action.payload.quantidade;
      } else {
        state.itens.push(action.payload);
      }
    },
    removerItem: (state, action: PayloadAction<string>) => {
      state.itens = state.itens.filter(i => i.id !== action.payload);
    },
    limparCarrinho: (state) => {
      state.itens = [];
    },
  },
});

export const { adicionarItem, removerItem, limparCarrinho } = cartSlice.actions;
export default cartSlice.reducer;
