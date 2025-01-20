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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(body) {
        try {
            const { email, password, username, role = 'user' } = body;
            return await this.authService.register(email, password, username, role);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Registration failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(body) {
        try {
            console.log('Login attempt with:', { email: body.email });
            const result = await this.authService.validateUser(body.email, body.password);
            if (!result) {
                console.log('Login failed: Invalid credentials');
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
            }
            console.log('Login successful for user:', result.user.email);
            return result;
        }
        catch (error) {
            console.error('Login error:', error);
            throw new common_1.HttpException(error.message || 'Login failed', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getAllUsers() {
        try {
            return await this.authService.getAllUsers();
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to fetch users', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateUser(id, updateData) {
        try {
            return await this.authService.updateUser(id, updateData);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to update user', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async deleteUser(id) {
        try {
            return await this.authService.deleteUser(id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Failed to delete user', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetAdminPassword() {
        try {
            await this.authService.resetAdminPassword();
            return { message: 'Admin password has been reset successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to reset admin password', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('reset-admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetAdminPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map