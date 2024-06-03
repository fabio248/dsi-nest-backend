import { Module } from '@nestjs/common';
import { PdfGeneratesService } from './pdf-generates.service';
import {DatabaseModule} from "../database/database.module";
import { ReportsController } from './reports.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PdfGeneratesService],
  controllers: [ReportsController]
})
export class PdfGeneratesModule {}
