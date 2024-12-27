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
  page: number = 1
): Promise<ProductResponse> {
  const res = await fetch(
    `http://localhost:8080/products?page=${page}&limit=20`,
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
