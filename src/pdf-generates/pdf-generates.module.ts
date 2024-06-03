import { Module } from '@nestjs/common';
import { PdfGeneratesService } from './services/pdf-generates.service';
import { DatabaseModule } from '../database/database.module';
import { ReportsController } from './reports.controller';
import { FilesModule } from '../files/files.module';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [DatabaseModule, FilesModule],
  providers: [PdfGeneratesService, ReportsService],
  controllers: [ReportsController],
})
export class PdfGeneratesModule {}
