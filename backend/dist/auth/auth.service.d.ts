import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        user: any;
        token: string;
    }>;
    register(email: string, password: string, username: string, role?: string): Promise<{
        id: number;
        email: string;
        username: string;
        role: string;
        created_at: Date;
        updated_at: Date;
    }>;
    resetAdminPassword(): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, updateData: Partial<User>): Promise<User>;
    deleteUser(id: number): Promise<void>;
}
