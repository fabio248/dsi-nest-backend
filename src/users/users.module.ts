import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { DatabaseModule } from '../database/database.module';
import { PetsModule } from '../pets/pets.module';
import { MailerModule } from '../mailer/mailer.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    forwardRef(() => PetsModule),
    DatabaseModule,
    MailerModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
