import { Controller, Get, Query } from '@nestjs/common';
import { SummaryService } from "./summary.service";

@Controller('summary')
export class SummaryController{
    constructor(private readonly summaryService: SummaryService){}
    @Get()
    getSummary( @Query('dateFrom') dateFrom?: string,  @Query('dateTo') dateTo?: string,){
        return this.summaryService.getSummary(dateFrom,dateTo);
    }

}