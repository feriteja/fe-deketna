"use server";

import { cookies } from "next/headers";

export async function directOrder(productId: number, quantity: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  const res = await fetch("http://localhost:8080/order", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        product_id: productId,
        quantity: quantity,
      },
    ]),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to place order");
  }

  return await res.json();
}
