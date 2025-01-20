import { Controller, Post, Get, Put, Delete, UseGuards, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; username: string; role?: string }
  ) {
    try {
      const { email, password, username, role = 'user' } = body;
      return await this.authService.register(email, password, username, role);
    } catch (error) {
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      console.log('Login attempt with:', { email: body.email });
      const result = await this.authService.validateUser(body.email, body.password);
      
      if (!result) {
        console.log('Login failed: Invalid credentials');
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED
        );
      }

      console.log('Login successful for user:', result.user.email);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    try {
      return await this.authService.getAllUsers();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>
  ) {
    try {
      return await this.authService.updateUser(id, updateData);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: number) {
    try {
      return await this.authService.deleteUser(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete user',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('reset-admin')
  async resetAdminPassword() {
    try {
      await this.authService.resetAdminPassword();
      return { message: 'Admin password has been reset successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to reset admin password',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
