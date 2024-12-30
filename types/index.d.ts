declare interface ProductType {
  id: number;
  name: string;
  price: number;
  stock: number;
  seller_id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
  seller: SellerMinType;
  category: CategoryMinType;
}

declare interface SellerMinType {
  id: number;
  name: string;
  image_url: string;
}

declare interface CategoryMinType {
  id: number;
  name: string;
  description: string;
}
