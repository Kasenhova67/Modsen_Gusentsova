import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../transactions/transaction.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getSummary(dateFrom?: string, dateTo?: string) {
    const qb = this.transactionRepository.createQueryBuilder('t');

    if (dateFrom) qb.andWhere('t.date >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('t.date <= :dateTo', { dateTo });

    const transactions = await qb.getMany();

    let totalIncome = 0;
    let totalExpense = 0;

    for (const transaction of transactions) {
      const amount = Number(transaction.amount);
      if (transaction.type === TransactionType.INCOME) {
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
      
      periodFrom = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      
      const lastDay = new Date(year, month + 1, 0).getDate();
      periodTo = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    } else if (periodFrom && !periodTo) {
      periodTo = periodFrom;
    } else if (!periodFrom && periodTo) {
      periodFrom = periodTo;
    }

    return {
      period: { from: periodFrom, to: periodTo },
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}