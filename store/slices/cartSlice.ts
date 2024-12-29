// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  total_price: number;
  image_url: string;
}

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload; // ✅ Directly update `items` without extra nesting
    },

    addItem: (state, action: PayloadAction<CartItem>) => {
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

      console.log("Updated Cart State:", state.items);
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCart, addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
