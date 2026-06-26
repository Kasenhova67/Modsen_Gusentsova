import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../transactions/transaction.entity";
import { Category } from "../categories/category.entity";
import { Repository } from "typeorm";
import { CategoryReportDto} from "./dto/category-report.dto";
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
        const { dateFrom, dateTo, type } = query;
        const { startDate, endDate } = this.getDateRange(dateFrom, dateTo);
        const isAll = !type || type === 'all';
        const qb = this.categoryRepo
            .createQueryBuilder('c')
            .leftJoin('c.transactions', 't')
            .select('c.id', 'categoryId')
            .addSelect('c.name', 'categoryName')
            .where('t.date >= :startDate', { startDate })
            .andWhere('t.date <= :endDate', { endDate })
            .groupBy('c.id')
            .addGroupBy('c.name');

        if (isAll) {
            qb.addSelect('SUM(CASE WHEN t.type = :incomeType THEN t.amount ELSE 0 END)', 'income')  // ← исправлено
            .addSelect('SUM(CASE WHEN t.type = :expenseType THEN t.amount ELSE 0 END)', 'expense')
            .setParameter('incomeType', 'income')
            .setParameter('expenseType', 'expense');
        } else{
            qb.addSelect('SUM(t.amount)', 'amount')
            .andWhere('t.type = :type', { type }); 
        }

        const result = await qb.getRawMany();

        if(isAll){
            let totalIncome = 0;
            let totalExpense = 0;
            
            for( const item of result ){
                totalIncome += Number(item.income);
                totalExpense += Number(item.expense);
            };
            let total = totalExpense + totalIncome;
            return {
                totalIncome,
                totalExpense,
                total,
                categories:result,
            };
        } else{
            let total = 0;
            for(const item of result){
                total+= Number(item.amount);
            };
            return{
                [type]: total,
                categories:result.map(item => ({categoryId: item.categoryId, categoryName: item.categoryName, amount: Number(item.amount),})),
            }
        }    
    }

    async getMonthlyTrend() {
        const months = this.getLastSixMonths();
        const firstMonth = months[0];
        const lastMonth = months[months.length - 1];
        const [year, month] = lastMonth.split('-').map(Number);
        const lastDay = new Date(year, month, 0).getDate(); 
        const endDate = `${lastMonth}-${String(lastDay).padStart(2, '0')}`;
        const startDate = `${firstMonth}-01`;
        const transactions = await this.transactionRepo
            .createQueryBuilder('t')
            .select("TO_CHAR(t.date, 'YYYY-MM')", 'month')
            .addSelect('SUM(CASE WHEN t.type = :incomeType THEN t.amount ELSE 0 END)', 'income')
            .addSelect('SUM(CASE WHEN t.type = :expenseType THEN t.amount ELSE 0 END)', 'expense')
            .where('t.date >= :startDate', { startDate })
            .andWhere('t.date <= :endDate', { endDate })
            .groupBy("TO_CHAR(t.date, 'YYYY-MM')")
            .orderBy("TO_CHAR(t.date, 'YYYY-MM')", 'ASC')
            .setParameter('incomeType', 'income')
            .setParameter('expenseType', 'expense')
            .getRawMany();

        const dataMap = new Map();
        for (const item of transactions) {
            dataMap.set(item.month, {income: Number(item.income),expense: Number(item.expense), });
        }

        const result = months.map(month => {const data = dataMap.get(month);
            return {
            month,
            income: data ? data.income : 0,
            expense: data ? data.expense : 0,
            };
        });

        return result;
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

    private getLastSixMonths(){
        const months = [];
        const now = new Date();
        for(let i = 5; i >=0; i--){
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = date.getFullYear();
            const month = String(date.getMonth()+1).padStart(2, '0');
            months.push(`${year}-${month}`);
        }
        return months;
    }

}