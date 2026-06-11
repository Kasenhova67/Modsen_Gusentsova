import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { Category } from './categories/category.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'kasenhiva_89123',
      database: 'expense_tracker',
      entities: [Category, Transaction],
      synchronize: true,
    }),
    CategoriesModule,
    TransactionsModule,
  ],
})
export class AppModule {}