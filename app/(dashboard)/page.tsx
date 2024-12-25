"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt_token");
    setToken(storedToken);

    // Mock fetching products
    setProducts([
      { id: 1, name: "Product 1", price: "$10", image: "/placeholder.jpg" },
      { id: 2, name: "Product 2", price: "$20", image: "/placeholder.jpg" },
      { id: 3, name: "Product 3", price: "$30", image: "/placeholder.jpg" },
    ]);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-4 py-2 shadow-md">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-[#00aa5b]">Deketna</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 rounded-md border p-2 focus:border-[#00aa5b] focus:ring-[#00aa5b]"
        />

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-[#00aa5b]">Cart</button>
          {token ? (
            <>
              <button
                onClick={() => router.push("/profile")}
                className="text-gray-700 hover:text-[#00aa5b]"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-gray-700 hover:text-[#00aa5b]"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/register")}
                className="text-gray-700 hover:text-[#00aa5b]"
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Product Grid */}
      <main className="p-4">
        <h2 className="mb-4 text-2xl font-semibold">Products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <div
                key={product.id}
                className="rounded-lg border bg-white p-4 shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full rounded-md object-cover"
                />
                <h3 className="mt-2 text-lg font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
                <button className="mt-2 w-full rounded-md bg-[#00aa5b] py-1 text-white hover:bg-[#008a4b]">
                  Add to Cart
                </button>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
