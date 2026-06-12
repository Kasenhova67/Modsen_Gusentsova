import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Controller('transactions')
export class TransactionsController{
  constructor(private readonly transactionService:TransactionsService){}

  @Post()
  create(@Body() createDto: CreateTransactionDto){
    return this.transactionService.create(createDto);
  }
  @Get()
  findAll(@Query() query: QueryTransactionDto) {
    return this.transactionService.findAll(query);
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