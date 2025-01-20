import { Cart } from './cart.entity';
import { Product } from './product.entity';
export declare class CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    cart: Cart;
    product: Product;
}
