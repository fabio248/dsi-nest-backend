import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { DatabaseModule } from '../database/database.module';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [DatabaseModule, PetsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
