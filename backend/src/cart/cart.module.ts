import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, OrderItem, Product, User]),
    ProductsModule
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule { }
