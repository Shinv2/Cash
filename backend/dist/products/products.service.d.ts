import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    create(productData: Partial<Product>): Promise<Product>;
    update(id: number, productData: Partial<Product>): Promise<Product>;
    delete(id: number): Promise<void>;
}
