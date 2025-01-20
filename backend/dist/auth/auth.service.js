"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        try {
            console.log("=== Login Attempt ===");
            console.log("Attempting login with email:", email);
            const user = await this.userRepository.findOne({ where: { email } });
            console.log("Database query completed");
            console.log("User found in database:", user ? "Yes" : "No");
            if (!user) {
                console.log("Authentication failed: No user found with email:", email);
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            console.log("Comparing passwords...");
            console.log("Input password length:", password?.length);
            console.log("Stored hash length:", user.password?.length);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Password comparison result:", isPasswordValid);
            if (!isPasswordValid) {
                console.log("Authentication failed: Invalid password for user:", email);
                throw new common_1.UnauthorizedException('Invalid email or password');
            }
            console.log("Password validation successful");
            console.log("User role:", user.role);
            const { password: _, ...result } = user;
            const payload = {
                email: user.email,
                sub: user.id,
                role: user.role
            };
            console.log("Generated JWT payload:", payload);
            const token = await this.jwtService.signAsync(payload);
            console.log("JWT token generated successfully");
            return {
                user: result,
                token: token
            };
        }
        catch (error) {
            console.error("=== Authentication Error ===");
            console.error("Error type:", error.constructor.name);
            console.error("Error message:", error.message);
            console.error("Stack trace:", error.stack);
            throw error;
        }
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            user: user,
            token: await this.jwtService.signAsync(payload),
        };
    }
    async register(email, password, username, role = 'user') {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            username,
            role,
        });
        const savedUser = await this.userRepository.save(user);
        const { password: _, ...result } = savedUser;
        return result;
    }
    async resetAdminPassword() {
        try {
            await this.userRepository.delete({ email: 'admin@example.com' });
            const newPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const admin = this.userRepository.create({
                email: 'admin@example.com',
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            await this.userRepository.save(admin);
            console.log('Admin user has been reset with new credentials:');
            console.log('Email: admin@example.com');
            console.log('Password: admin123');
            console.log('Hashed password:', hashedPassword);
            return true;
        }
        catch (error) {
            console.error('Error resetting admin password:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            return await this.userRepository.find({
                select: ['id', 'email', 'username', 'role', 'created_at', 'updated_at']
            });
        }
        catch (error) {
            throw new Error('Failed to fetch users');
        }
    }
    async updateUser(id, updateData) {
        try {
            const { password, ...safeUpdateData } = updateData;
            await this.userRepository.update(id, safeUpdateData);
            const updatedUser = await this.userRepository.findOne({ where: { id } });
            if (!updatedUser) {
                throw new Error('User not found');
            }
            return updatedUser;
        }
        catch (error) {
            throw new Error(error.message || 'Failed to update user');
        }
    }
    async deleteUser(id) {
        try {
            const result = await this.userRepository.delete(id);
            if (result.affected === 0) {
                throw new Error('User not found');
            }
        }
        catch (error) {
            throw new Error(error.message || 'Failed to delete user');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map