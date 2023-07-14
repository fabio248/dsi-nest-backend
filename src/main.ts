import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Veterinaria Mitsum')
    .setDescription('API REST para veterinaria Mitsum')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
