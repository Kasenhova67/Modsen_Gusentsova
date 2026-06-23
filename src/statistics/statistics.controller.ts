import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CategoryReportDto } from './dto/category-report.dto';
import { MonthlyTrendDto } from './dto/monthly-trend.dto';
import { TopCategoriesDto } from './dto/top-categories.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('categories')
  getCategoryReport(@Query() query: CategoryReportDto) {
    return this.statisticsService.getCategoryReport(query);
  }

  @Get('monthly')
  getMonthlyTrend(@Query() query: MonthlyTrendDto) {
    return this.statisticsService.getMonthlyTrend(query);
  }

  @Get('top')
  getTopCategories(@Query() query: TopCategoriesDto) {
    return this.statisticsService.getTopCategories(query);
  }
}