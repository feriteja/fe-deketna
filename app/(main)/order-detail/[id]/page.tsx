import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

export interface ApiResponse {
  data: OrderDetail;
  message: string;
}

export interface OrderDetail {
  buyer_name: string;
  created_at: string;
  order_id: number;
  order_items: OrderItem[];
  status: string;
  total_amount: number;
  updated_at: string;
}

export interface OrderItem {
  image_url: string;
  price: number;
  product_name: string;
  quantity: number;
  total_price: number;
}

async function fetchOrderDetails(id: string): Promise<ApiResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  const res = await fetch(`http://localhost:8080/order/${id}`, {
    headers: {
      "Content-Type": "application/json", // Ensure JSON format
      Authorization: `Bearer ${token}`, // Use an environment variable for the token
    },
    cache: "default",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order details");
  }

  return res.json();
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let order: OrderDetail | null = null;
  let error: string | null = null;

  try {
    const { id } = await params;

    const res = await fetchOrderDetails(id);
    order = res.data;
  } catch (err: any) {
    console.log(err);
    error = err.message || "Something went wrong";
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : order ? (
        <>
          <div className="mb-4">
            <p>
              <strong>Order ID:</strong> {order.order_id}
            </p>
            <p>
              <strong>Pembeli:</strong> {order.buyer_name}
            </p>
            <p>
              <strong>Tanggal Pembelian:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Nama Produk</TableHead>
                <TableHead className="w-[15%]">Harga</TableHead>
                <TableHead className="w-[15%]">Kuantitas</TableHead>
                <TableHead className="w-[20%]">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>Rp.{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    Rp.{(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <div className="text-lg font-semibold">
              Total Jumlah: Rp.{order.total_amount.toFixed(2)}
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link href={"/orders"}>Kembali</Link>
            </Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
