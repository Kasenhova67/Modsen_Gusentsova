import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getSummary(dateFrom?: string, dateTo?: string) {
    const qb = this.transactionRepository.createQueryBuilder('transDate');
    
    if (dateFrom) qb.andWhere('transDate.date >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('transDate.date <= :dateTo', { dateTo });
    
    const transactions = await qb.getMany();
    
    let totalIncome = 0;
    let totalExpense = 0;
    
    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    }
    let periodFrom = dateFrom;
    let periodTo = dateTo;
    if (!periodFrom && !periodTo) {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      periodFrom = new Date(year, month, 1).toISOString().split('T')[0];
      periodTo = new Date(year, month + 1, 0).toISOString().split('T')[0];
    }
    
    return {
      period: { from: periodFrom, to: periodTo },
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}