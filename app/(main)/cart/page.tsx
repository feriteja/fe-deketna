// app/cart/page.tsx
"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { removeItem, clearCart } from "../../../store/slices/cartSlice";
import Image from "next/image";

export default function CartPage() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  console.log({ cart });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart &&
              cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b py-2"
                >
                  <Image
                    src={item.image_url}
                    width={80}
                    height={80}
                    alt={item.product_name}
                  />
                  <div>
                    <h3>{item.product_name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
          <button
            onClick={() => dispatch(clearCart())}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}
