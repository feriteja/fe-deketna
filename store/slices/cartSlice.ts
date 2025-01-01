// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReduxCartItem {
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
  image_url: string;
  isSelected?: boolean;
}

export type CartState = {
  items: ReduxCartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<ReduxCartItem[]>) => {
      state.items = action.payload; // ✅ Directly update `items` without extra nesting
    },

    addItem: (state, action: PayloadAction<ReduxCartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
      }
    },

    selectCartItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload
      );

      if (existingItem) {
        existingItem.isSelected = !existingItem.isSelected;
      }
    },

    selectCartItemAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach((item) => {
        item.isSelected = action.payload;
      });
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (item) => item.product_id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  clearCart,
  selectCartItem,
  selectCartItemAll,
} = cartSlice.actions;
export default cartSlice.reducer;
