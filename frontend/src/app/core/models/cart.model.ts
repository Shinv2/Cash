export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
  };
}

export interface Cart {
  id: number;
  user_id: number;
  items: CartItem[];
  total: number;
}
