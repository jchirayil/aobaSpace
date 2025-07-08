import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // Get ConfigService instance

  // Determine CORS origin based on environment from config
  const corsOrigin = configService.get<string>('CORS_ORIGIN');
  const appPort = configService.get<number>('PORT');

  // Log the environment and CORS origin for debugging
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin configured: ${corsOrigin}`);
  console.log(`Application Port configured: ${appPort}`);


  // Enable CORS for frontend communication
  app.enableCors({
    origin: corsOrigin, // Use the dynamically determined origin
    methods: 'GET,HEAD,PUT,PATCH,POST',
    credentials: true,
  });

  // Enable global validation pipes for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(appPort);
  console.log(`AobaSpace API is running on: http://localhost:${appPort}`);
}
bootstrap();