import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        username: string;
        role?: string;
    }): Promise<{
        id: number;
        email: string;
        username: string;
        role: string;
        created_at: Date;
        updated_at: Date;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<any>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, updateData: Partial<User>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    resetAdminPassword(): Promise<{
        message: string;
    }>;
}
