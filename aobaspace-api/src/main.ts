import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? '[https://your-aobaspace-web-domain.com](https://your-aobaspace-web-domain.com)' : 'http://localhost:3001', // Adjust for your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable global validation pipes for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips properties not defined in DTOs
    forbidNonWhitelisted: true, // Throws error if non-whitelisted properties are sent
    transform: true, // Automatically transforms payloads to DTO instances
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`AobaSpace API is running on: http://localhost:${port}`);
}
bootstrap();