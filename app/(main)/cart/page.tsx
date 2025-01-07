"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CartPage = () => {
  const { cartItems, toggleSelection, reloadCart, toggleSelectAll } = useCart();
  const [selectAll, setSelectAll] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    toggleSelectAll(newSelectAll);
  };

  const totalPrice = cartItems
    .filter((item) => item.isSelected) // Only keep selected items
    .reduce((prev, next) => prev + next.price * next.quantity, 0);

  const totalQuantity = cartItems
    .filter((item) => item.isSelected) // Only keep selected items
    .reduce((prev, next) => prev + next.quantity, 0);

  const handleOrder = async () => {
    try {
      const orderItem = cartItems
        .filter((item) => item.isSelected)
        .map((item) => {
          return { product_id: item.product_id, quantity: item.quantity };
        });

      await axios.post("http://localhost:8080/order", orderItem, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      reloadCart();
      router.push("/");
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken && !authToken) {
      setAuthToken(savedToken);
    }
    reloadCart();
  }, []);

  return (
    <div className="container mx-auto px-24 py-10 bg-slate-100">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Section: Cart Items */}
        <div className="flex-1 space-y-2">
          <div className="bg-white h-16 flex flex-row p-4 items-center gap-5 rounded-t-lg ">
            <input
              type="checkbox"
              className="h-4 w-4 "
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <h1 className="font-bold text-md">Pilih Semua</h1>
          </div>
          {cartItems.map((item) => (
            <Card
              key={item.product_id}
              className="p-4 flex items-center gap-4 shadow-none border-none"
            >
              <input
                type="checkbox"
                checked={item.isSelected || false}
                className="h-4 w-4 "
                onChange={() => toggleSelection(item.product_id)}
              />
              <div className="w-[80px] h-[80px] rounded-sm  overflow-hidden relative shadow-md">
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{item.product_name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p className="font-bold">${item.price}</p>
              </div>
              <Button variant="destructive" size="sm">
                Remove
              </Button>
            </Card>
          ))}
        </div>

        {/* Right Section: Order Summary */}
        <div className="w-full md:w-1/3 p-4 border bg-white rounded-md h-fit sticky top-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Jumlah barang: </span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Total Harga:</span>
              <span>${totalPrice}</span>
            </div>
            <Button onClick={handleOrder} className="w-full mt-4">
              Proses Beli
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
