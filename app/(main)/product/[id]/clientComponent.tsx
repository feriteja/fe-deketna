"use client";

import { addToCart } from "@/actions/cartActions";
import { directOrder } from "@/actions/orderActions";
import { addItem } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

function ClientComponent({ product }: any) {
  const router = useRouter();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Handle Add to Cart
  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(product.id, quantity);
      dispatch(
        addItem({
          product_name: product.name,
          price: product.price,
          quantity: 1,
          product_id: product.id,
          total_price: product.price,
          image_url: product.image_url,
        })
      );
      alert("✅ Product added to cart successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to add product to cart.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle Direct Order
  const handleDirectOrder = async () => {
    setIsLoading(true);
    try {
      await directOrder(product.id, quantity);
      alert("✅ Order placed successfully!");
      router.push("/orders"); // Redirect to Orders Page
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 🔢 Quantity Selector */}
      <div className="mt-6">
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min="1"
          max={product.stock}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* 🛒 Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className={`w-1/2 px-4 py-2 rounded-md text-white font-semibold ${
            isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Adding..." : "🛒 Add to Cart"}
        </button>
        <button
          onClick={handleDirectOrder}
          disabled={isLoading}
          className={`w-1/2 px-4 py-2 rounded-md text-white font-semibold ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Ordering..." : "🚀 Direct Order"}
        </button>
      </div>
    </div>
  );
}

export default ClientComponent;
