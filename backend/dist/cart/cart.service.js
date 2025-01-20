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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
const order_item_entity_1 = require("../entities/order-item.entity");
const product_entity_1 = require("../entities/product.entity");
const user_entity_1 = require("../entities/user.entity");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(cartRepository, cartItemRepository, orderItemRepository, productRepository, userRepository, dataSource, productsService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.productsService = productsService;
    }
    async getCart(userId) {
        const cart = await this.cartRepository.findOne({
            where: { userId },
            relations: ['items', 'items.product']
        });
        if (!cart) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
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
    async addToCart(userId, productId, quantity) {
        try {
            const product = await this.productsService.findOne(productId);
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            if (product.quantity < quantity) {
                throw new common_1.BadRequestException('Not enough stock available');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
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
            let cartItem = cart.items?.find(item => item.product_id === productId);
            if (cartItem) {
                cartItem.quantity += quantity;
                cartItem.price = product.price * cartItem.quantity;
                await this.cartItemRepository.save(cartItem);
            }
            else {
                cartItem = this.cartItemRepository.create({
                    cart_id: cart.id,
                    product_id: product.id,
                    quantity,
                    price: product.price * quantity
                });
                await this.cartItemRepository.save(cartItem);
            }
            const updatedCart = await this.getCart(userId);
            updatedCart.total = updatedCart.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
            await this.cartRepository.save(updatedCart);
            return this.getCart(userId);
        }
        catch (error) {
            console.error('Error adding item to cart:', error);
            throw new common_1.InternalServerErrorException('Failed to add item to cart: ' + error.message);
        }
    }
    async removeFromCart(userId, productId) {
        const cart = await this.getCart(userId);
        const cartItem = await this.cartItemRepository.findOne({
            where: { cart_id: cart.id, product_id: productId },
            relations: ['product'],
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Item not found in cart');
        }
        cart.total -= cartItem.price;
        await this.cartRepository.save(cart);
        await this.cartItemRepository.remove(cartItem);
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        await this.cartItemRepository.delete({ cart_id: cart.id });
        cart.total = 0;
        await this.cartRepository.save(cart);
    }
    async updateQuantity(userId, productId, quantity) {
        try {
            const cart = await this.getCart(userId);
            const cartItem = await this.cartItemRepository.findOne({
                where: { cart_id: cart.id, product_id: productId },
                relations: ['product'],
            });
            if (!cartItem) {
                throw new common_1.NotFoundException('Item not found in cart');
            }
            const product = await this.productRepository.findOne({
                where: { id: productId }
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            if (product.quantity < quantity) {
                throw new common_1.BadRequestException('Not enough stock available');
            }
            cartItem.quantity = quantity;
            cartItem.price = product.price * quantity;
            await this.cartItemRepository.save(cartItem);
            const updatedCart = await this.getCart(userId);
            updatedCart.total = updatedCart.items.reduce((sum, item) => sum + Number(item.price), 0);
            await this.cartRepository.save(updatedCart);
            return this.getCart(userId);
        }
        catch (error) {
            console.error('Error updating cart item quantity:', error);
            throw new common_1.InternalServerErrorException('Failed to update quantity: ' + error.message);
        }
    }
    async checkout(userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const cart = await this.getCart(userId);
            if (!cart || !cart.items?.length) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            for (const item of cart.items) {
                const product = await this.productRepository.findOne({
                    where: { id: item.product_id }
                });
                if (!product) {
                    throw new common_1.NotFoundException(`Product with id ${item.product_id} not found`);
                }
                if (product.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Not enough stock for ${product.name}. Only ${product.quantity} available.`);
                }
                const orderItem = this.orderItemRepository.create({
                    cart_id: cart.id,
                    product_id: item.product_id,
                    username: cart.username,
                    product_name: product.name,
                    quantity: item.quantity,
                    price: item.price
                });
                await this.orderItemRepository.save(orderItem);
                product.quantity -= item.quantity;
                await this.productRepository.save(product);
            }
            await queryRunner.query('DELETE FROM active_cart_items WHERE cart_id = $1', [cart.id]);
            cart.total = 0;
            await this.cartRepository.save(cart);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('Checkout error:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getOrderHistory(userId) {
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
        return items.map(item => ({
            ...item,
            createdAt: item.createdAt.toISOString()
        }));
    }
    async purchaseCart(userId, purchaseDto) {
        try {
            const cart = await this.cartRepository.findOne({
                where: { userId },
                relations: ['items', 'items.product']
            });
            if (!cart || !cart.items?.length) {
                throw new common_1.BadRequestException('Cart is empty');
            }
            for (const item of cart.items) {
                const product = await this.productRepository.findOne({
                    where: { id: item.product_id }
                });
                if (!product || product.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product: ${product?.name || item.product_id}`);
                }
                product.quantity -= item.quantity;
                await this.productRepository.save(product);
            }
            await this.clearCart(userId);
            return {
                message: 'Purchase successful',
                total: cart.total
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to process purchase');
        }
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cart_entity_1.Cart)),
    __param(1, (0, typeorm_1.InjectRepository)(cart_item_entity_1.CartItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        products_service_1.ProductsService])
], CartService);
//# sourceMappingURL=cart.service.js.map