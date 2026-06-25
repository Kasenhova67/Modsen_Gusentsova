import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoriesService } from '../categories/categories.service';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { ERROR_TRANSACTION_NOT_FOUND, ERROR_DATE_IN_FUTURE } from '../constants';
import { filterBySearch, sortByField, paginate } from '../common/other/functions';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
  ) {}

  private validateDate(date: string): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(date) > today) {
      throw new BadRequestException(ERROR_DATE_IN_FUTURE);
    }
  }

  async create(createDto: CreateTransactionDto) {
    await this.categoriesService.findOne(createDto.categoryId);
    this.validateDate(createDto.date);

    const transaction = Transaction.create(
      createDto.amount,
      createDto.type as TransactionType,
      createDto.categoryId,
      createDto.date,
      createDto.description,
    );

    return await this.transactionRepository.save(transaction);
  }

  async findAll(query: QueryTransactionDto) {
    const { page, limit, type, categoryId, dateFrom, dateTo, search, sortBy, sortOrder } = query;

    let transactions = await this.transactionRepository.find();

    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    if (categoryId) {
      transactions = transactions.filter(t => t.categoryId === categoryId);
    }
    if (dateFrom) {
      transactions = transactions.filter(t => t.date >= dateFrom);
    }
    if (dateTo) {
      transactions = transactions.filter(t => t.date <= dateTo);
    }
    if (search) {
      transactions = filterBySearch(transactions, search, t => t.description);
    }

    const sorted = sortByField(transactions, sortBy as keyof Transaction, sortOrder);
    return paginate(sorted, page, limit);
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new NotFoundException(ERROR_TRANSACTION_NOT_FOUND);
    }
    return transaction;
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    return await this.transactionRepository.remove(transaction);
  }

  async update(id: string, updateDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);

    if (updateDto.categoryId !== undefined) {
      await this.categoriesService.findOne(updateDto.categoryId);
      transaction.updateCategoryId(updateDto.categoryId);
    }
    if (updateDto.date !== undefined) {
      transaction.updateDate(updateDto.date);
    }
    if (updateDto.amount !== undefined) {
      transaction.updateAmount(updateDto.amount);
    }
    if (updateDto.type !== undefined) {
      transaction.updateType(updateDto.type as TransactionType);
    }
    if (updateDto.description !== undefined) {
      transaction.updateDescription(updateDto.description);
    }

    return await this.transactionRepository.save(transaction);
  }
}