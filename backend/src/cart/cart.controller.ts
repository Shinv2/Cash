import { Controller, Get, Post, Delete, Body, UseGuards, Request, Param, Put, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PurchaseDto } from './dto/purchase.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  async addToCart(
    @Request() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.addToCart(
      req.user.id,
      body.productId,
      body.quantity,
    );
  }

  @Post('update-quantity')
  async updateQuantity(
    @Request() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.updateQuantity(
      req.user.id,
      body.productId,
      body.quantity,
    );
  }

  @Delete('remove/:productId')
  async removeFromCart(
    @Request() req,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(req.user.id, parseInt(productId, 10));
  }



  @Post('purchase')
  async purchaseCart(@Request() req, @Body() purchaseDto: PurchaseDto) {
    return this.cartService.purchaseCart(req.user.id, purchaseDto);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Request() req) {
    try {
      await this.cartService.checkout(req.user.id);
      return { message: 'Checkout successful' };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error processing checkout');
    }
  }

  @Get('order-history')
  async getAllOrderHistory() {
    try {
      return await this.cartService.getAllOrderHistory();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching order history');
    }
  }
}
//endpoint nemeh cart