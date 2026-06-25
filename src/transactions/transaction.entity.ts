import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';
import { BadRequestException } from '@nestjs/common';
import { ERROR_DATE_IN_FUTURE, ERROR_AMOUNT_POSITIVE, ERROR_TYPE_INVALID } from '../constants';

export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'type', type: 'varchar' })
  type: TransactionType;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column({ name: 'categoryId' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  static create(
    amount: number,
    type: TransactionType,
    categoryId: string,
    date: string,
    description?: string,
  ): Transaction {
    const transaction = new Transaction();
    transaction.amount = amount;
    transaction.type = type;
    transaction.categoryId = categoryId;
    transaction.date = date;
    transaction.description = description || '';
    return transaction;
  }

  updateAmount(newAmount: number): void {
    if (newAmount <= 0) {
      throw new BadRequestException(ERROR_AMOUNT_POSITIVE);
    }
    this.amount = newAmount;
  }

  updateDate(newDate: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(newDate) > today) {
      throw new BadRequestException(ERROR_DATE_IN_FUTURE);
    }
    this.date = newDate;
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  updateCategoryId(newCategoryId: string): void {
    this.categoryId = newCategoryId;
  }

  updateType(newType: TransactionType): void {
    if (!Object.values(TransactionType).includes(newType)) {
      throw new BadRequestException(ERROR_TYPE_INVALID);
    }
    this.type = newType;
  }
}