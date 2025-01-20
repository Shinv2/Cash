import { Repository, DataSource } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { ProductsService } from '../products/products.service';
import { PurchaseDto } from './dto/purchase.dto';
export declare class CartService {
    private readonly cartRepository;
    private readonly cartItemRepository;
    private readonly orderItemRepository;
    private readonly productRepository;
    private readonly userRepository;
    private readonly dataSource;
    private readonly productsService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, orderItemRepository: Repository<OrderItem>, productRepository: Repository<Product>, userRepository: Repository<User>, dataSource: DataSource, productsService: ProductsService);
    getCart(userId: number): Promise<Cart>;
    addToCart(userId: number, productId: number, quantity: number): Promise<Cart>;
    removeFromCart(userId: number, productId: number): Promise<Cart>;
    clearCart(userId: number): Promise<void>;
    updateQuantity(userId: number, productId: number, quantity: number): Promise<Cart>;
    checkout(userId: number): Promise<void>;
    getOrderHistory(userId: number): Promise<OrderItem[]>;
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
        cart: Cart;
        product: Product;
    }[]>;
    purchaseCart(userId: number, purchaseDto: PurchaseDto): Promise<{
        message: string;
        total: number;
    }>;
}
