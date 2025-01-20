import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';//hash password

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log("=== Login Attempt ===");
      console.log("Attempting login with email:", email);
      
      const user = await this.userRepository.findOne({ where: { email } });
      console.log("Database query completed");
      console.log("User found in database:", user ? "Yes" : "No");
      
      if (!user) {
        console.log("Authentication failed: No user found with email:", email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log("Comparing passwords...");
      console.log("Input password length:", password?.length);
      console.log("Stored hash length:", user.password?.length);
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password comparison result:", isPasswordValid);

      if (!isPasswordValid) {
        console.log("Authentication failed: Invalid password for user:", email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log("Password validation successful");
      console.log("User role:", user.role);
      
      const { password: _, ...result } = user;
      
      // Generate JWT token
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
    } catch (error) {
      console.error("=== Authentication Error ===");
      console.error("Error type:", error.constructor.name);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
      throw error;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user: user,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, password: string, username: string, role: string = 'user') {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
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
      // Delete existing admin if exists
      await this.userRepository.delete({ email: 'admin@example.com' });

      // Create new admin user
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
    } catch (error) {
      console.error('Error resetting admin password:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['id', 'email', 'username', 'role', 'created_at', 'updated_at']
      });
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    try {
      // Don't allow updating the password through this endpoint
      const { password, ...safeUpdateData } = updateData;
      
      await this.userRepository.update(id, safeUpdateData);
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new Error('User not found');
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }
}
