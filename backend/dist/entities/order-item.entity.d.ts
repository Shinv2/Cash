import { Cart } from './cart.entity';
import { Product } from './product.entity';
export declare class OrderItem {
    id: number;
    cart_id: number;
    product_id: number;
    username: string;
    product_name: string;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    cart: Cart;
    product: Product;
}
