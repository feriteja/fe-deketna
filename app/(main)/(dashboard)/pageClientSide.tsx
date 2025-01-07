"use client";

import ProductCard from "@/components/ProductCard";
import debounce from "lodash.debounce";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  keyword,
}: {
  initialData: ProductResponse;
  keyword: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialData.data);
  const [page, setPage] = useState<number>(initialData.pagination.page);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialData.pagination.isNext
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  // Infinite Scroll Logic
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/products?page=${
          page + 1
        }&limit=20&search_product=${keyword}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
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
  }, [isLoading, hasMore, page, keyword]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        loadMoreProducts();
      }
    }, 300); // 300ms delay

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreProducts]);

  useEffect(() => {
    setProducts(initialData.data);
  }, [keyword, router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
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
