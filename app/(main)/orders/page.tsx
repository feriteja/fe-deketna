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
import OrderTable from "./orderTable";

interface Order {
  order_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItems[];
}

interface OrderItems {
  order_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

interface Pagination {
  isNext: boolean;
  isPrev: boolean;
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

interface ApiResponse {
  data: Order[];
  pagination: Pagination;
  message: string;
}

// Fetch data server-side
async function fetchOrders(page: number = 1): Promise<ApiResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || null; // Fetch token from cookies

  const res = await fetch(`http://localhost:8080/orders?page=${page}`, {
    headers: {
      "Content-Type": "application/json", // Ensure JSON format
      Authorization: `Bearer ${token}`, // Use an environment variable for the token
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }

  return res.json();
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const currentPage = Number((await searchParams).page) || 1;
  let orders: Order[] = [];
  let pagination: Pagination | null = null;
  let error: string | null = null;

  try {
    const result = await fetchOrders(currentPage);
    orders = result.data;
    pagination = result.pagination;
  } catch (err: any) {
    error = err.message || "Something went wrong";
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <OrderTable orders={orders} />
          <div className="flex justify-between mt-4">
            <Button variant="outline" disabled={!pagination?.isPrev} asChild>
              <a
                href={`/orders?page=${currentPage - 1}`}
                className={`${
                  !pagination?.isPrev && "pointer-events-none opacity-50"
                }`}
              >
                Previous
              </a>
            </Button>
            <span>
              Halaman {pagination?.page} dari {pagination?.totalPages}
            </span>
            <Button variant="outline" disabled={!pagination?.isNext} asChild>
              <a
                href={`/orders?page=${currentPage + 1}`}
                className={`${
                  !pagination?.isNext && "pointer-events-none opacity-50"
                }`}
              >
                Next
              </a>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
