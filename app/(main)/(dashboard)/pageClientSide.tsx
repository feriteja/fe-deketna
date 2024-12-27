"use client";

import ProductCard from "@/components/ProductCard";
import { useState, useEffect, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  seller_id: number;
  seller_name: string;
}

interface ProductResponse {
  data: Product[];
  pagination: {
    page: number;
    totalPages: number;
    isNext: boolean;
  };
}
// ✅ Client-Side Component with Infinite Scroll
export default function ClientDashboard({
  initialData,
}: {
  initialData: ProductResponse;
}) {
  const [products, setProducts] = useState<Product[]>(initialData.data);
  const [page, setPage] = useState<number>(initialData.pagination.page);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialData.pagination.isNext
  );

  // Infinite Scroll Logic
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page + 1}&limit=10`);
      if (response.ok) {
        const data: ProductResponse = await response.json();
        setProducts((prev) => [...prev, ...data.data]);
        setPage(data.pagination.page);
        setHasMore(data.pagination.isNext);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {isLoading && (
        <p className="text-center mt-4">Loading more products...</p>
      )}
      {!hasMore && (
        <p className="text-center mt-4 text-gray-500">
          No more products to load.
        </p>
      )}
    </div>
  );
}
