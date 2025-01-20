import { CartService } from './cart.service';
import { PurchaseDto } from './dto/purchase.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("../entities/cart.entity").Cart>;
    addToCart(req: any, body: {
        productId: number;
        quantity: number;
    }): Promise<import("../entities/cart.entity").Cart>;
    updateQuantity(req: any, body: {
        productId: number;
        quantity: number;
    }): Promise<import("../entities/cart.entity").Cart>;
    removeFromCart(req: any, productId: string): Promise<import("../entities/cart.entity").Cart>;
    clearCart(req: any): Promise<void>;
    purchaseCart(req: any, purchaseDto: PurchaseDto): Promise<{
        message: string;
        total: number;
    }>;
    checkout(req: any): Promise<{
        message: string;
    }>;
    getAllOrderHistory(): Promise<{
        createdAt: string;
        id: number;
        cart_id: number;
        product_id: number;
        username: string;
        product_name: string;
        quantity: number;
        price: number;
        updatedAt: Date;
        cart: import("../entities/cart.entity").Cart;
        product: import("../entities/product.entity").Product;
    }[]>;
}
