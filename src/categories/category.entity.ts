import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { BadRequestException } from '@nestjs/common';
import { ERROR_NAME_LENGTH, ERROR_INVALID_COLOR } from '../constants';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'color' })
  color: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  static create(name: string, color: string): Category {
    const category = new Category();
    category.name = name;
    category.color = color;
    return category;
  }

  updateName(newName: string): void {
    if (newName.length < 2 || newName.length > 50) {
      throw new BadRequestException(ERROR_NAME_LENGTH);
    }
    this.name = newName;
  }

  updateColor(newColor: string): void {
    if (!/^#([A-Fa-f0-9]{6})$/.test(newColor)) {
      throw new BadRequestException(ERROR_INVALID_COLOR);
    }
    this.color = newColor;
  }
}