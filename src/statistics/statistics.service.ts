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
  
    }
}