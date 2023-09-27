import { Module } from '@nestjs/common';
import { GeneratePdfController } from './generate-pdf.controller';
import { GeneratePdfService } from './generate-pdf.service';
import { PetsModule } from 'src/pets/pets.module';
import { SpeciesModule } from 'src/species/species.module';
@Module({
  imports: [PetsModule, SpeciesModule],
  controllers: [GeneratePdfController],
  providers: [GeneratePdfService],
})
export class GeneratePdfModule {}
