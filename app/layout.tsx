"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { loadCart, setCart } from "@/store/slices/cartSlice";

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
      localStorage.setItem("cart", JSON.stringify(state.cart));
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

// Separate Loader Component for clarity
function CartLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Simulate cart loading (e.g., from localStorage or API)
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch(setCart(JSON.parse(savedCart)));
    } else {
      dispatch(loadCart());
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}
