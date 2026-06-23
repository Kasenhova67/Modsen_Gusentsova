import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {StatisticsController} from './statistics.controller';
import {StatisticsService} from './statistics.service';
import { Transaction } from '../transactions/transaction.entity';
import { Category } from '../categories/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction,Category])],
    controllers:[ StatisticsController],
    providers: [StatisticsService],
})
export class StatisticsModule {}
