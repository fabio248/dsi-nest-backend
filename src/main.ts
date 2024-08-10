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

  const PREFIX = 'api/v';
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: PREFIX,
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
  SwaggerModule.setup(`${PREFIX}1/docs`, app, document);

  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/${PREFIX}1`);
    console.log(`Swagger running on http://localhost:${port}/${PREFIX}1/docs`);
  });
}
bootstrap();
