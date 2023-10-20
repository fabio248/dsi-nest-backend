import { Module } from '@nestjs/common';
import { BillsService } from './services/bills.service';
import { BillsController } from './bills.controller';
import { BillsDetailsService } from './services/bills-details.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BillsController],
  providers: [BillsService, BillsDetailsService],
})
export class BillsModule {}
