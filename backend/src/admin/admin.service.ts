import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // User Management
  async getAllUsers() {
    return this.userRepository.find();
  }

  async updateUser(id: number, userData: any) {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  // Product Management
  async getAllProducts() {
    return this.productRepository.find();
  }

  async createProduct(productData: any) {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: any) {
    await this.productRepository.update(id, productData);
    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number) {
    return this.productRepository.delete(id);
  }
}
