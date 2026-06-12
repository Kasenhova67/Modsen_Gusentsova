import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoriesService } from '../categories/categories.service';
import {QueryTransactionDto} from './dto/query-transaction.dto';
import { ERROR_TRANSACTION_NOT_FOUND, ERROR_DATE_IN_FUTURE } from '../constants';


@Injectable()  
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) 
    private transactionRepository: Repository<Transaction>, 
    private categoriesService: CategoriesService,) {}

    async create(createDto: CreateTransactionDto){
        const category = await this.categoriesService.findOne(createDto.categoryId);
        const today = new Date();
        today.setHours(0,0,0,0);
        const transactiondate = new Date(createDto.date);
        if( transactiondate > today) {
            throw new BadRequestException(ERROR_DATE_IN_FUTURE);
        }
        const newTransaction = this.transactionRepository.create(createDto);
        return await this.transactionRepository.save(newTransaction);
    }
    async findAll(query: QueryTransactionDto) {
        const { page, limit, type, categoryId, dateFrom, dateTo, search, sortBy, sortOrder } = query;
        
        const qb = this.transactionRepository.createQueryBuilder('t');
        
        if (type) qb.andWhere('t.type = :type', { type });
        if (categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId });
        if (dateFrom) qb.andWhere('t.date >= :dateFrom', { dateFrom });
        if (dateTo) qb.andWhere('t.date <= :dateTo', { dateTo });
        if (search) qb.andWhere('t.description ILIKE :search', { search: `%${search}%` });
        
        qb.orderBy(`t.${sortBy}`, sortOrder);
        qb.skip((page - 1) * limit).take(limit);
        
        const [data, total] = await qb.getManyAndCount();
        
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id: string){
        const transaction = await this.transactionRepository.findOne({where: {id}});
        if(!transaction){
            throw new NotFoundException(ERROR_TRANSACTION_NOT_FOUND); 
        }
        return transaction;
    }
    async remove( id:string){
        const transaction = await this.findOne(id);
        return await this.transactionRepository.remove(transaction);
    }
    async update(id: string, updateDto: UpdateTransactionDto) {
        const transaction = await this.findOne(id);
        if (updateDto.categoryId !== undefined) {
            await this.categoriesService.findOne(updateDto.categoryId);
            transaction.categoryId = updateDto.categoryId;
        }
        if (updateDto.date !== undefined) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const newDate = new Date(updateDto.date);
            if (newDate > today) {
                throw new BadRequestException(ERROR_DATE_IN_FUTURE);
            }
            transaction.date = updateDto.date;
        }        
        if (updateDto.amount !== undefined) transaction.amount = updateDto.amount;
        if (updateDto.type !== undefined) transaction.type = updateDto.type;
        if (updateDto.description !== undefined) transaction.description = updateDto.description;

        return await this.transactionRepository.save(transaction);
    }
    
}