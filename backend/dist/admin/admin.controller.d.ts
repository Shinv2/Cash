import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<import("../entities/user.entity").User[]>;
    updateUser(id: string, userData: any): Promise<import("../entities/user.entity").User>;
    deleteUser(id: string): Promise<import("typeorm").DeleteResult>;
    getAllProducts(): Promise<import("../entities/product.entity").Product[]>;
    createProduct(productData: any): Promise<import("../entities/product.entity").Product[]>;
    updateProduct(id: string, productData: any): Promise<import("../entities/product.entity").Product>;
    deleteProduct(id: string): Promise<import("typeorm").DeleteResult>;
}
