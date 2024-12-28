"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { setCart } from "@/store/slices/cartSlice";
import axios from "axios";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Save cart state to localStorage whenever it changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();

      localStorage.setItem("cart", JSON.stringify(state.cart.items));
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <CartLoader />
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </Provider>
  );
}

function CartLoader() {
  const dispatch = useDispatch();

  // Fetch cart data from the API
  const getCart = async () => {
    try {
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

      console.log("API Cart Data:", response.data?.data || []);
      return response.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return [];
    }
  };

  // Load cart data on component mount
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        dispatch(setCart(parsedCart));
      } else {
        const cartData = await getCart();

        if (Array.isArray(cartData) && cartData.length > 0) {
          dispatch(setCart(cartData));
          localStorage.setItem("cart", JSON.stringify(cartData)); // ✅ Save cartData directly
        } else {
          dispatch(setCart([])); // Explicitly set an empty cart
        }
      }
    };

    loadCart();
  }, [dispatch]);

  return null; // This component doesn't render anything
}
