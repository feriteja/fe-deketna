"use client";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  seller_id: number;
  seller_name: string;
}

type Props = {
  onClick: () => void;
  product: Product;
};

function SearchCard({ product, onClick }: Props) {
  return (
    <div
      onClick={() => onClick()}
      className="flex  py-2 hover:bg-slate-50 hover:cursor-pointer space-x-2 "
    >
      <div className="w-20 h-20 relative">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div>
        <h1>{product.name}</h1>
        <h2 className="font-semibold">{product.price}</h2>
      </div>
    </div>
  );
}

export default SearchCard;
