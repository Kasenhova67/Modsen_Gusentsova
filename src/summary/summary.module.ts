import { TransactionsModule } from "../transactions/transactions.module";
import { Module } from "@nestjs/common";
import { SummaryController } from "./summary.controller";
import { SummaryService } from "./summary.service";

@Module( {
    imports: [TransactionsModule],
    controllers:[ SummaryController],
    providers: [SummaryService],
})
export class SummaryModule{}