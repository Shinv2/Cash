import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
export declare class AdminService {
    private userRepository;
    private productRepository;
    constructor(userRepository: Repository<User>, productRepository: Repository<Product>);
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, userData: any): Promise<User>;
    deleteUser(id: number): Promise<import("typeorm").DeleteResult>;
    getAllProducts(): Promise<Product[]>;
    createProduct(productData: any): Promise<Product[]>;
    updateProduct(id: number, productData: any): Promise<Product>;
    deleteProduct(id: number): Promise<import("typeorm").DeleteResult>;
}
