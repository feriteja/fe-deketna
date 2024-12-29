// app/dashboard/ProductCard.tsx

import { Product } from "@/actions/productAction";
import Image from "next/image";
import ProductCardButton from "./ProductCardButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border rounded-md p-4 shadow-md hover:shadow-lg transition">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          width={300}
          height={200}
          className="w-full h-40 object-contain rounded-md"
        />
      ) : (
        <div className="w-full h-40 object-cover rounded-md" />
      )}
      <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">Price: ${product.price}</p>
      <p className="text-gray-500">Stock: {product.stock}</p>
      <p className="text-sm text-gray-400">Seller: {product.seller_name}</p>
      <ProductCardButton product={product} />
    </div>
  );
}
