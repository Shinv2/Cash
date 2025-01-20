"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const dotenv_1 = require("dotenv");
const user_entity_1 = require("../entities/user.entity");
const product_entity_1 = require("../entities/product.entity");
const cart_entity_1 = require("../entities/cart.entity");
const cart_item_entity_1 = require("../entities/cart-item.entity");
(0, dotenv_1.config)();
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [user_entity_1.User, product_entity_1.Product, cart_entity_1.Cart, cart_item_entity_1.CartItem],
    synchronize: false,
    logging: true,
};
//# sourceMappingURL=database.config.js.map