import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { DatabaseModule } from '../database/database.module';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [forwardRef(() => PetsModule), DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
