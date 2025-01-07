import Image from "next/image";
import ClientComponent from "./clientComponent";

// ✅ Fetch Product Detail
async function fetchProductDetail(productId: string) {
  const res = await fetch(`http://localhost:8080/product/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  const response = await res.json();
  return response.data;
}

// ✅ Product Detail Page Component
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductDetail(id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🛍️ Product Detail Card */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-2 md:grid-cols-2 gap-6 p-6">
        {/* 🖼️ Product Image */}
        <div className="flex w-full h-full justify-center items-center relative">
          <Image
            src={product.image_url || "/placeholder.jpg"}
            alt={product.name}
            fill
            className="rounded-md object-contain "
          />
        </div>

        {/* 📋 Product Information */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 mt-2">
              Sold by: <strong>{product.seller_name}</strong>
            </p>
            <p className="text-2xl font-semibold text-green-600 mt-4">
              Rp.{product.price.toLocaleString()}
            </p>
            <p className="text-gray-600 mt-2">Stock: {product.stock}</p>
          </div>

          <ClientComponent product={product} />
        </div>
      </div>

      {/* 📄 Additional Information */}
      <div className="bg-gray-50 p-4 rounded-md shadow-md mt-8">
        <h2 className="text-xl font-semibold mb-2">📦 Product Details</h2>
        <p className="text-gray-700">
          This is a placeholder for product description. Add more details about
          the product here to give customers better insight.
        </p>
      </div>
    </div>
  );
}
