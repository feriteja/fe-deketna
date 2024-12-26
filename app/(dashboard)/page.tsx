import HeaderServer from "@/components/Header.server";
import { cookies } from "next/headers";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default async function Dashboard() {
  const token = (await cookies()).get("access_token")?.value || null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <HeaderServer />
      {/* Product Grid */}
      <main className="p-4">
        <h2 className="mb-4 text-2xl font-semibold">Products</h2>
        {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((product) => (
              <div
                key={product.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
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
        </div> */}
      </main>
    </div>
  );
}
