import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController{
  constructor(private readonly transactionService:TransactionsService){}

  @Post()
  create(@Body() createDto: CreateTransactionDto){
    return this.transactionService.create(createDto);
  }
  @Get()
  findAll( @Query('page') page?: string, @Query('limit') limit?: string, @Query('type') type?: string,
    @Query('categoryId') categoryId?: string, @Query('dateFrom') dateFrom?: string, @Query('dateTo') dateTo?: string,
    @Query('search') search?: string, @Query('sortBy') sortBy?: string,  @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    const sortByField = sortBy || 'date';
    const sortOrderValue = sortOrder || 'DESC';
    return this.transactionService.findAll(pageNum,limitNum, type, categoryId, dateFrom, dateTo, search, sortByField,  sortOrderValue, );
  }
  @Get(':id')
  findOne(@Param('id') id:string){
    return this.transactionService.findOne(id);
  }
  @Delete(':id')
  remove(@Param ('id') id: string){
    return this.transactionService.remove(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTransactionDto){
    return this.transactionService.update(id,updateDto);
  }
}