import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT = process.env.PORT || 3000;

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  console.log(`Application is running on: ${PORT}`);
}
bootstrap();
