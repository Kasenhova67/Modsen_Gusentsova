import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

export type TransactionType = 'expense' | 'income';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  private _id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  private _amount: number;

  @Column({ type: 'varchar' })
  private _type: TransactionType;

  @Column({ nullable: true })
  private _description: string;

  @Column({ type: 'date' })
  private _date: string;

  @CreateDateColumn()
  private _createdAt: Date;

  @UpdateDateColumn()
  private _updatedAt: Date;

  @Column()
  private _categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'categoryId' })
  private _category: Category;

  get id(): string { return this._id; }
  get amount(): number { return Number(this._amount); }
  get type(): TransactionType { return this._type; }
  get description(): string { return this._description; }
  get date(): string { return this._date; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get categoryId(): string { return this._categoryId; }
  get category(): Category { return this._category; }

  static create(
    amount: number,
    type: TransactionType,
    categoryId: string,
    date: string,
    description?: string,
  ): Transaction {
    const transaction = new Transaction();
    transaction._amount = amount;
    transaction._type = type;
    transaction._categoryId = categoryId;
    transaction._date = date;
    transaction._description = description || '';
    return transaction;
  }

  updateAmount(newAmount: number): void {
    if (newAmount <= 0) {
      throw new Error('Amount must be positive');
    }
    this._amount = newAmount;
  }

  updateDate(newDate: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(newDate) > today) {
      throw new Error('Date cannot be in the future');
    }
    this._date = newDate;
  }

  updateDescription(newDescription: string): void {
    this._description = newDescription;
  }

  updateCategoryId(newCategoryId: string): void {
    this._categoryId = newCategoryId;
  }

  updateType(newType: TransactionType): void {
    if (!['expense', 'income'].includes(newType)) {
      throw new Error('Type must be "expense" or "income"');
    }
    this._type = newType;
  }
}