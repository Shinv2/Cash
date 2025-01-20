"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'admin',
    database: 'shop_db',
    synchronize: false,
    logging: true,
    entities: [user_entity_1.User, product_entity_1.Product, cart_entity_1.Cart, cart_item_entity_1.CartItem],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
});
//# sourceMappingURL=dataSource.js.map