import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'shop_db',
  synchronize: false,
  logging: true,
  entities: [User, Product, Cart, CartItem],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
// Data source configuration: defines the connection to the database
//data source config