"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrderTable({ orders }: { orders: any[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[7%]">ID</TableHead>
          <TableHead className="w-[40%]">Nama</TableHead>
          <TableHead className="w-[25%]">Total Jumlah</TableHead>
          <TableHead className="w-[15%]">Status</TableHead>
          <TableHead className="w-[20%]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const name = order.order_items[0]?.product_name || "No Product";
          const count = order.order_items.length;
          const title = `${name}, + ${count - 1} produk lainnya`;

          return (
            <TableRow
              key={order.order_id}
              onClick={() => router.push(`/order-detail/${order.order_id}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell className="w-[7%]">{order.order_id}</TableCell>
              <TableCell className="w-[40%] font-semibold">{title}</TableCell>
              <TableCell className="w-[25%]">
                Rp.{order.total_amount.toFixed(2)}
              </TableCell>
              <TableCell className="w-[15%]">{order.status}</TableCell>
              <TableCell className="w-[20%]">
                {new Date(order.created_at).toLocaleString()}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
