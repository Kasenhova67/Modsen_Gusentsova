import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../transactions/transaction.entity";
import { Category } from "../categories/category.entity";
import { Repository } from "typeorm";
import { CategoryReportDto} from "./dto/category-report.dto";
import { MonthlyTrendDto } from "./dto/monthly-trend.dto";
import { TopCategoriesDto } from "./dto/top-categories.dto";

@Injectable()
export class StatisticsService{
    constructor(
        @InjectRepository(Transaction)
        private transactionRepo: Repository<Transaction>,
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ){}

    async getCategoryReport(query: CategoryReportDto) {
       
    }

    async getMonthlyTrend(query: MonthlyTrendDto) {
       
    }

    async getTopCategories(query: TopCategoriesDto) {
        const { dateFrom, dateTo } = query;
        const { startDate, endDate } = this.getDateRange(dateFrom, dateTo);
        const qb = this.transactionRepo
            .createQueryBuilder('t')
            .leftJoinAndSelect('t.category', 'c')
            .select('c.id', 'id')
            .addSelect('c.name', 'name')
            .addSelect('SUM(t.amount)', 'total')
            .where('t.type = :type', { type: 'expense' })
            .andWhere('t.date >= :startDate', { startDate })
            .andWhere('t.date <= :endDate', { endDate })
            .groupBy('c.id')
            .addGroupBy('c.name')
            .orderBy('SUM(t.amount)', 'DESC')
            .limit(5);

        const result = await qb.getRawMany();
        return result;
    }


    private getDateRange(dateFrom?: string, dateTo?: string) {
        let startDate = dateFrom;
        let endDate = dateTo;
        if (!startDate && !endDate) {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            startDate = new Date(year, month, 1).toISOString().split('T')[0];
            endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
        } else if (startDate && !endDate) {
            endDate = startDate;
        } else if (!startDate && endDate) {
            startDate = endDate;
        }
        return { startDate, endDate };
    }
}