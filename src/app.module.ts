import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { configuration } from './config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { SpeciesModule } from './species/species.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.get('env');
        if (env !== 'test') {
          return {
            pinoHttp: {
              transport: { target: 'pino-pretty' },
            },
          };
        }
        return {
          pinoHttp: {
            transport: { target: 'pino-pretty' },
          },
        };
      },
    }),
    UsersModule,
    AuthModule,
    SpeciesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
