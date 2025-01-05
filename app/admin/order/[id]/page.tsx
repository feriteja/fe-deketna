// app/admin/orders/[id]/page.tsx

import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";

// ✅ Set dynamic metadata for SEO
export const metadata: Metadata = {
  title: "Order Detail",
  description: "Detailed view of a specific order",
};

// ✅ Fetch Order Detail Data
async function fetchOrderDetail(orderId: string, token: string) {
  const res = await fetch(`http://localhost:8080/admin/order/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store", // Ensure fresh data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order details");
  }

  const response = await res.json();
  return response.data;
}

// ✅ Order Detail Page Component
export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies
  const order = await fetchOrderDetail(params.id, token!);

  return (
    <div className="p-6 space-y-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold">Order Detail - #{order.order_id}</h1>

      {/* 🛒 Buyer Information */}
      <section className="mb-4">
        <h2 className="text-lg font-semibold">Buyer Information</h2>
        <p>
          <strong>Name:</strong> {order.buyer.name}
        </p>
        <p>
          <strong>Email:</strong> {order.buyer.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.buyer.phone}
        </p>
      </section>

      {/* 📦 Order Items */}
      <section>
        <h2 className="text-lg font-semibold">Order Items</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item: any, index: number) => (
              <tr key={index}>
                <td className="p-2 border text-center">
                  <Image
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.product_name}
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                </td>
                <td className="p-2 border">{item.product_name}</td>
                <td className="p-2 border">Rp.{item.price.toFixed(2)}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">Rp.{item.total_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 💵 Total Amount */}
      <section className="mt-4">
        <h2 className="text-lg font-semibold">Total Amount</h2>
        <p className="text-xl font-bold">Rp.{order.total_amount.toFixed(2)}</p>
      </section>

      {/* 📅 Status and Dates */}
      <section className="mt-4">
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(order.updated_at).toLocaleString()}
        </p>
      </section>
    </div>
  );
}
