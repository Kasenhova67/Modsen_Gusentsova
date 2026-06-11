import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      
      password: 'kasenhiva_89123',
      database: 'expense_tracker',
      entities: [Category],
      synchronize: true,
    }),
    CategoriesModule,
  ],
})
export class AppModule {}