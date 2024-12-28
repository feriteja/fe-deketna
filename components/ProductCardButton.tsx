"use client";
import { addItem } from "../store/slices/cartSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "@/actions/productAction";

interface ProductCardProps {
  product: Product;
}

export default function ProductCardButton({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if window and localStorage are available
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("access_token"));
    }
  }, []);
  const handleAddToCart = async () => {
    try {
      // Call API to add item to server-side cart
      const cartItem = await axios.post(
        `http://localhost:8080/cart`,
        {
          product_id: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(
        addItem({
          id: cartItem?.data?.data?.cart_id,
          product_name: product.name,
          price: product.price,
          quantity: 1,
          product_id: product.id,
          total_price: product.price,
          image_url: product.image_url,
        })
      );

      console.log("Item added to cart successfully");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };
  return (
    <button
      onClick={handleAddToCart}
      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
    >
      Add to Cart
    </button>
  );
}
