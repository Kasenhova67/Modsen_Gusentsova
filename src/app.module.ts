import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SummaryModule } from './summary/summary.module';
import { StatisticsModule } from './statistics/statistics.module';
import { Category } from './categories/category.entity';
import { Transaction } from './transactions/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const url = config.get('DATABASE_URL');

        return {
          type: 'postgres',
          ...(url ? { url } : {
            host: config.get('DB_HOST'),
            port: parseInt(config.get('DB_PORT'), 10),
            username: config.get('DB_USER'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_NAME'),
          }),
          entities: [Category, Transaction],
          synchronize: true,
          ssl: url ? { rejectUnauthorized: false } : false,
        };
      },
      inject: [ConfigService],
    }),
    CategoriesModule,
    TransactionsModule,
    SummaryModule,
    StatisticsModule,
  ],
})
export class AppModule {}
