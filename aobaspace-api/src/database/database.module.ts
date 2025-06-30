import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'; // To access environment variables
import { User } from '../users/entities/user.entity'; // Import your entities here

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Get DATABASE_URL from .env
        entities: [User], // List all your TypeORM entities here
        synchronize: true, // WARNING: set to false in production and use migrations
        logging: true, // Enable logging for development
      }),
    }),
  ],
  exports: [TypeOrmModule], // Export TypeOrmModule so other modules can use repositories
})
export class DatabaseModule {}