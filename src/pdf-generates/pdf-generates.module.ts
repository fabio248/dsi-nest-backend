import { Module } from '@nestjs/common';
import { PdfGeneratesService } from './pdf-generates.service';
import {DatabaseModule} from "../database/database.module";
import { ReportsController } from './reports.controller';
import {FilesModule} from "../files/files.module";

@Module({
  imports: [DatabaseModule, FilesModule],
  providers: [PdfGeneratesService],
  controllers: [ReportsController]
})
export class PdfGeneratesModule {}
