import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { ProductsService } from '../products/products.service';
import { PurchaseDto } from './dto/purchase.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product']
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const newCart = this.cartRepository.create({
        userId,
        username: user.username,
        total: 0
      });

      return this.cartRepository.save(newCart);
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    try {
      // Check if product exists and has enough stock
      const product = await this.productsService.findOne(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      if (product.quantity < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      // Get user info
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get or create cart
      let cart = await this.cartRepository.findOne({ 
        where: { userId },
        relations: ['items', 'items.product']
      });

      if (!cart) {
        cart = this.cartRepository.create({ 
          userId, 
          total: 0,
          username: user.username 
        });
        cart = await this.cartRepository.save(cart);
      }

      // Check if item already exists in cart
      let cartItem = cart.items?.find(item => item.product_id === productId);

      if (cartItem) {
        // Update existing item
        cartItem.quantity += quantity;
        cartItem.price = product.price * cartItem.quantity;
        await this.cartItemRepository.save(cartItem);
      } else {
        // Create new cart item
        cartItem = this.cartItemRepository.create({
          cart_id: cart.id,
          product_id: product.id,
          quantity,
          price: product.price * quantity
        });
        await this.cartItemRepository.save(cartItem);
      }

      // Update cart total
      const updatedCart = await this.getCart(userId);
      updatedCart.total = updatedCart.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
      await this.cartRepository.save(updatedCart);

      return this.getCart(userId);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw new InternalServerErrorException('Failed to add item to order: ' + error.message);
    }
  }

  async removeFromCart(userId: number, productId: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    const cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: productId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    cart.total -= cartItem.price;
    await this.cartRepository.save(cart);
    await this.cartItemRepository.remove(cartItem);

    return this.getCart(userId);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cart_id: cart.id });
    cart.total = 0;
    await this.cartRepository.save(cart);
  }

  async updateQuantity(userId: number, productId: number, quantity: number): Promise<Cart> {
    try {
      const cart = await this.getCart(userId);
      const cartItem = await this.cartItemRepository.findOne({
        where: { cart_id: cart.id, product_id: productId },
        relations: ['product'],
      });

      if (!cartItem) {
        throw new NotFoundException('Item not found in cart');
      }

      // Check if product has enough stock
      const product = await this.productRepository.findOne({ 
        where: { id: productId }
      });
      
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      if (product.quantity < quantity) {
        throw new BadRequestException('Not enough stock available');
      }

      // Update quantity and price
      cartItem.quantity = quantity;
      cartItem.price = product.price * quantity;
      await this.cartItemRepository.save(cartItem);

      // Update cart total
      const updatedCart = await this.getCart(userId);
      updatedCart.total = updatedCart.items.reduce((sum, item) => sum + Number(item.price), 0);
      await this.cartRepository.save(updatedCart);

      return this.getCart(userId);
    } catch (error) {
      console.error('Error updating order item quantity:', error);
      throw new InternalServerErrorException('Failed to update quantity: ' + error.message);
    }
  }

  async checkout(userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.getCart(userId);
      if (!cart || !cart.items?.length) {
        throw new BadRequestException('Order is empty');
      }

      // First, create order items for history
      for (const item of cart.items) {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id }
        });

        if (!product) {
          throw new NotFoundException(`Product with id ${item.product_id} not found`);
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Not enough stock for ${product.name}. Only ${product.quantity} available.`);
        }

        // Create order item for history
        const orderItem = this.orderItemRepository.create({
          cart_id: cart.id,
          product_id: item.product_id,
          username: cart.username,
          product_name: product.name,  // Save the product name
          quantity: item.quantity,
          price: item.price
        });
        await this.orderItemRepository.save(orderItem);

        // Decrease product quantity
        product.quantity -= item.quantity;
        await this.productRepository.save(product);
      }

      // Clear the active cart items using raw SQL to ensure all items are removed
      await queryRunner.query(
        'DELETE FROM active_cart_items WHERE cart_id = $1',
        [cart.id]
      );

      // Reset cart total
      cart.total = 0;
      await this.cartRepository.save(cart);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Checkout error:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderHistory(userId: number): Promise<OrderItem[]> {
    const cart = await this.cartRepository.findOne({
      where: { userId }
    });

    if (!cart) {
      return [];
    }

    return this.orderItemRepository.find({
      where: { cart_id: cart.id },
      relations: ['product'],
      order: { createdAt: 'DESC' }
    });
  }

  async getAllOrderHistory() {
    const items = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select([
        'orderItem.id',
        'orderItem.quantity',
        'orderItem.price',
        'orderItem.createdAt',
        'orderItem.username',
        'orderItem.product_name'
      ])
      .orderBy('orderItem.createdAt', 'DESC')
      .getMany();

    // Format dates to ISO string for consistent handling
    return items.map(item => ({
      ...item,
      createdAt: item.createdAt.toISOString()
    }));
  }

  async purchaseCart(userId: number, purchaseDto: PurchaseDto) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { userId },
        relations: ['items', 'items.product']
      }); 

      if (!cart || !cart.items?.length) {
        throw new BadRequestException('Cart is empty');
      }

      // Verify stock availability and update product quantities
      for (const item of cart.items) {
        const product = await this.productRepository.findOne({ 
          where: { id: item.product_id }
        });
        
        if (!product || product.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product?.name || item.product_id}`);
        }

        // Update product quantity
        product.quantity -= item.quantity;
        await this.productRepository.save(product);
      }

      // Create order record (you'll need to implement this)
      // const order = await this.orderService.createOrder({
      //   userId,
      //   items: cart.items,
      //   total: cart.total,
      //   ...purchaseDto
      // });

      // Clear the cart
      await this.clearCart(userId);

      return { 
        message: 'Purchase successful',
        // orderId: order.id,
        total: cart.total
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to process purchase');
    }
  }
}
