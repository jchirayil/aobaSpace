import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // For environment variables
import { TypeOrmModule } from '@nestjs/typeorm'; // For database integration
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env variables accessible throughout the app
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // Load specific .env file
    }),
    DatabaseModule, // Import the database module
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}