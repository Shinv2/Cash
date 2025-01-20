import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // User Management
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() userData: any) {
    return this.adminService.updateUser(+id, userData);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  // Product Management
  @Get('products')
  getAllProducts() {
    return this.adminService.getAllProducts();
  }

  @Post('products')
  createProduct(@Body() productData: any) {
    return this.adminService.createProduct(productData);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: string, @Body() productData: any) {
    return this.adminService.updateProduct(+id, productData);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(+id);
  }
}
