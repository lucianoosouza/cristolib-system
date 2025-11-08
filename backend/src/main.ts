import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // <- import default

async function bootstrap() {
  const server = express(); // agora funciona
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors();

  await app.listen(3000);
}
bootstrap();