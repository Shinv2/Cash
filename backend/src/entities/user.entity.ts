import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true }) // temporarily allow null
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['admin', 'user'], default: 'user' })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
