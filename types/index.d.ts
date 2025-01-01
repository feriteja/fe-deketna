declare interface ProductType {
  id: number;
  name: string;
  price: number;
  stock: number;
  seller_id: number;
  category_id: number;
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

declare interface ProfileType {
  address: string;
  created_at: string;
  id: number;
  image_url: string;
  name: string;
  updated_at: string;
  user: UserType;
  user_id: number;
}

declare interface UserType {
  created_at: string;
  deleted_at: string;
  email: string;
  id: number;
  phone: string;
  role: string;
  updated_at: string;
}
