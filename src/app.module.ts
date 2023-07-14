import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { configuration } from './config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';
import { SpeciesModule } from './species/species.module';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
      },
    }),
    UsersModule,
    AuthModule,
    PetsModule,
    SpeciesModule,
    DatabaseModule,
    MailerModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
