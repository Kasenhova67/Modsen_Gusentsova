import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()  
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) 
    private transactionRepository: Repository<Transaction>, 
    private categoriesService: CategoriesService,) {}

    async create(createDto: CreateTransactionDto){
        const category = await this.categoriesService.findOne(createDto.categoryId);
        if(!category){
            throw new NotFoundException('Category not found');
        }
        const today = new Date();
        today.setHours(0,0,0,0);
        const transactiondate = new Date(createDto.date);
        if( transactiondate > today) {
            throw new BadRequestException('Date is in the future');
        }
        const newTransaction = this.transactionRepository.create(createDto);
        return await this.transactionRepository.save(newTransaction);
    }
    async findAll(page: number = 1, limit: number = 20, type?: string, categoryId?: string, dateFrom?: string, dateTo?: string, search?: string, sortBy: string = 'date', sortOrder: 'ASC' | 'DESC' = 'DESC',){
        let allTransactions = await this.transactionRepository.find();
        if (type){
            const filter = [];
            for ( let i = 0; i< allTransactions.length; i++){
                if(allTransactions[i].type === type){
                    filter.push(allTransactions[i]);
                }
            }
        }
        if(categoryId){
            let filter =[];
            for (let i = 0; i < allTransactions.length; i++){
                if(allTransactions[i].categoryId  === categoryId){
                    filter.push(allTransactions[i]);
                }
            }
        }
        if(dateFrom){
            let filter = [];
            for( let i = 0; i< allTransactions.length; i++){
                if(allTransactions[i].date>= dateFrom){
                    filter.push(allTransactions[i]);
                }
            }
        }
        if(dateTo){
            let filter = [];
            for( let i = 0; i< allTransactions.length; i++){
                if(allTransactions[i].date <= dateTo){
                    filter.push(allTransactions[i]);
                }
            }
        }

// поиск и сортировка сделать


        let totalCount = allTransactions.length;
        const startIndex =(page - 1)*limit;
        const data = [];
        for (let i = startIndex; i < startIndex + limit && i < allTransactions.length; i++) {
            data.push(allTransactions[i]);
        }
    
        return {data: data, limit: limit, page: page, total: totalCount, totalPages: Math.ceil(totalCount/limit),};
    }
    async findOne(id: string){
        const transaction = await this.transactionRepository.findOne({where: {id}});
        if(!transaction){
            throw new NotFoundException('Transaction not found');
        }
        return transaction;
    }
// сделать сводку

    async remove( id:string){
        const transaction = await this.findOne(id);
        return await this.transactionRepository.remove(transaction);
    }
    async update(id: string, updateDto: UpdateTransactionDto){
        const transaction = await this.findOne(id);
        if(updateDto.amount !== undefined) transaction.amount = updateDto.amount;
        if(updateDto.categoryId !== undefined) transaction.categoryId = updateDto.categoryId;
        if(updateDto.date !== undefined) transaction.date = updateDto.date;
        if(updateDto.description !== undefined) transaction.description = updateDto.description;
        if(updateDto.type !== undefined) transaction.type = updateDto.type;

        return await this.transactionRepository.save(transaction);
    }

}