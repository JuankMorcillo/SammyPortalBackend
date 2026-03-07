import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Esto permite que '1' pase a 1 automáticamente
    }
  }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  app.use('/public/', express.static(join(process.cwd(), 'public')));

  // Configuración Swagger
  if (configService.get('swagger.enabled')) {
    const config = new DocumentBuilder()
      .setTitle(String(configService.get('swagger.title')))
      .setDescription(String(configService.get('swagger.description')))
      .setVersion(String(configService.get('swagger.version')))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(
      String(configService.get('swagger.path')),
      app,
      document,
      configService.get('swagger.customOptions')
    );
  }

  await app.listen(process.env.APP_PORT ?? 3000);
  console.log('Corriendo en el Puerto: ', process.env.APP_PORT ?? 3000);
}
bootstrap();
