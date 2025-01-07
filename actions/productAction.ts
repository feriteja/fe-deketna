"use server";

import axios from "axios";
import { revalidatePath } from "next/cache";

// app/dashboard/actions.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  seller_id: number;
  seller_name: string;
}

export interface ProductResponse {
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    isNext: boolean;
    isPrev: boolean;
  };
}

// Fetch products from the backend
export async function fetchProducts(
  page: number = 1,
  keyword: string
): Promise<ProductResponse> {
  const res = await fetch(
    `http://localhost:8080/products?page=${page}&limit=20&search_product=${keyword}`,
    {
      // next: { revalidate: 60 }, // Revalidate every 60 seconds
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function refreshSearch() {
  revalidatePath("/search");
}
