import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: number;
    userId: number;
    username: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    items: CartItem[];
}
