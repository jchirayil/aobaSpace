import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService); // Get ConfigService instance

  console.log('ConfigService initialized:', configService);
  console.log('Process environment variables:', process.env);

  // Determine CORS origin based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigin = isProduction ? 'https://your-aobaspace-web-domain.com' : 'http://localhost:3001';

  // Log the environment and CORS origin for debugging
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`CORS Origin configured: ${corsOrigin}`);

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

  // Retrieve port from ConfigService, falling back to 3000
  // Use process.env.PORT directly for listening, as it's what the container exposes
  const port = parseInt(process.env.PORT || '3000', 10);

  // Detailed logging for port resolution
  console.log(`Port from process.env: ${process.env.PORT}`);
  console.log(`Port from ConfigService.get('PORT'): ${configService.get<number>('PORT')}`);
  console.log(`Final API listening port: ${port}`);


  await app.listen(port);
  console.log(`AobaSpace API is running on: http://localhost:${port}`);
}
bootstrap();