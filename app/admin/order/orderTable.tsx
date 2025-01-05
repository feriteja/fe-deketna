"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "./page";
import OrderActions from "./components/OrderActions";
import { useRouter } from "next/navigation";

function OrderTable({ order, page }: { order: Order; page: number }) {
  const router = useRouter();
  const firstItem = order.order_items[0];
  const name = firstItem?.product_name || "No Product";
  const count = order.order_items.length;
  const title = `${name}, + ${count - 1} other(s)`;

  return (
    <TableRow
      key={order.order_id}
      onClick={() => router.push(`/admin/order/${order.order_id}`)}
    >
      <TableCell>{order.order_id}</TableCell>
      <TableCell>
        <img
          src={firstItem?.image_url || "/placeholder.png"}
          alt="Product"
          className="w-12 h-12 object-cover rounded-md"
        />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>{order.buyer.name}</TableCell>
      <TableCell>Rp.{order.total_amount.toFixed(2)}</TableCell>
      <TableCell>
        <strong> {order.status}</strong>
      </TableCell>
      <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
      <TableCell>
        <OrderActions
          orderId={order.order_id}
          status={order.status}
          page={Number(page)}
        />
      </TableCell>
    </TableRow>
  );
}

export default OrderTable;
