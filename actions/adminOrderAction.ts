"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateOrderStatus(
  orderId: number,
  action: string,
  page: number
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

    if (!token) {
      throw new Error("Unauthorized: Missing access token");
    }

    const res = await fetch(
      `http://localhost:8080/admin/order/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: action }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update order status");
    }

    revalidatePath(`/admin/orders?page=${page}`);

    return await res.json();
  } catch (error: any) {
    console.error("Error updating order status:", error.message);
    throw error;
  }
}
