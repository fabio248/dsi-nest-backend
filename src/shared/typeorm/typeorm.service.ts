import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// import { User } from '../../users/entities/user.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    if (this.configService.get('env') === 'test') {
      return {
        type: this.configService.get<'postgres' | 'mysql' | 'mariadb'>(
          'database.type',
        ),
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('test.database.port'),
        username: this.configService.get<string>('database.username'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('test.database.name'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
      };
    } else {
      return {
        type: this.configService.get<'postgres' | 'mysql' | 'mariadb'>(
          'database.type',
        ),
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        username: this.configService.get<string>('database.username'),
        password: this.configService.get<string>('database.password'),
        database: this.configService.get<string>('database.name'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        synchronize: true,
      };
    }
  }
}
