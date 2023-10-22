import { Module } from '@nestjs/common';
import { GeneratePdfController } from './generate-pdf.controller';
import { GeneratePdfService } from './generate-pdf.service';
import { PetsModule } from 'src/pets/pets.module';
import { SpeciesModule } from 'src/species/species.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [PetsModule, SpeciesModule, UsersModule],
  controllers: [GeneratePdfController],
  providers: [GeneratePdfService],
})
export class GeneratePdfModule {}
