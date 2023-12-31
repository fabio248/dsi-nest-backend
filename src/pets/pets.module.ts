import { Module, forwardRef } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { SpeciesModule } from '../species/species.module';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../database/database.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    DatabaseModule,
    SpeciesModule,
    forwardRef(() => UsersModule),
    forwardRef(() => FilesModule),
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
