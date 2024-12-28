// app/dashboard/ProductCard.tsx

"use client";
import { Product } from "@/actions/productAction";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/cartSlice";
import axios from "axios";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
      await axios.post(
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

      // Update local state management
      console.log(111111);

      dispatch(
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      );

      console.log(222222);
      console.log("Item added to cart successfully");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };
  return (
    <div className="bg-white border rounded-md p-4 shadow-md hover:shadow-lg transition">
      <Image
        src={product.image_url}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-40 object-cover rounded-md"
      />
      <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">Price: ${product.price}</p>
      <p className="text-gray-500">Stock: {product.stock}</p>
      <p className="text-sm text-gray-400">Seller: {product.seller_name}</p>
      <button
        onClick={handleAddToCart}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
}
