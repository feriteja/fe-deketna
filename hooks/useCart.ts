import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CartState,
  clearCart,
  ReduxCartItem,
  selectCartItem,
  selectCartItemAll,
  setCart,
} from "@/store/slices/cartSlice";
import { store } from "@/store";

export const useCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(
    (state: { cart: CartState }) => state.cart.items
  ); // Adjust state type if needed

  // Fetch cart data from the API
  const getCart = async () => {
    try {
      if (typeof window === "undefined") return [];
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.warn("No access token found");
        return [];
      }

      const response = await axios.get(
        `http://localhost:8080/cart?page=1&limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(setCart(response.data?.data || []));
      return response.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return [];
    }
  };

  const toggleSelection = (id: number) => {
    dispatch(selectCartItem(id));
  };

  const toggleSelectAll = (selectAll: boolean) => {
    dispatch(selectCartItemAll(selectAll));
  };

  const clearItemsCart = () => {
    dispatch(clearCart());
  };

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (typeof window === "undefined") return;
        const savedCart = localStorage.getItem("cart");

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart) as ReduxCartItem[];
          dispatch(setCart(parsedCart));
        } else {
          const cartData = await getCart();
          if (Array.isArray(cartData) && cartData.length > 0) {
            dispatch(setCart(cartData));
          } else {
            dispatch(setCart([]));
          }
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
  }, [dispatch]);

  // Save cart state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem("cart", JSON.stringify(state.cart.items));
    });

    return () => unsubscribe();
  }, [cartItems]);

  return {
    cartItems,
    reloadCart: getCart, // Expose reload function if needed
    toggleSelection,
    toggleSelectAll,
    clearItemsCart,
  };
};
