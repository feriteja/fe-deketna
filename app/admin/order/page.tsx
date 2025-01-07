import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";
import OrderTable from "./orderTable";

export interface Order {
  order_id: number;
  order_items: {
    image_url: string;
    product_name: string;
    quantity: number;
  }[];
  buyer: {
    name: string;
  };
  total_amount: number;
  status: string;
  created_at: string;
}

interface OrdersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getOrders({ page }: { page: number }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies
  const res = await fetch(`http://localhost:8080/admin/orders?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // Prevent caching in SSR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await res.json();
  return data.data as Order[];
}

export default async function AdminOrderPage({
  searchParams,
}: OrdersPageProps) {
  const { page } = await searchParams;

  const orders = await getOrders({ page: Number(page) });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Order List</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[5%]">ID</TableHead>
            <TableHead className="w-[10%]">Image</TableHead>
            <TableHead className="w-[20%]">Name</TableHead>
            <TableHead className="w-[15%]">Buyer</TableHead>
            <TableHead className="w-[10%]">Total Amount</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[15%]">Created At</TableHead>
            <TableHead className="w-[15%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => {
            return (
              <OrderTable
                key={order.order_id}
                page={Number(page)}
                order={order}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
