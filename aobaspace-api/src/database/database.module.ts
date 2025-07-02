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
        host: configService.get<string>('POSTGRES_HOST'), // CHANGED: Use explicit host
        port: configService.get<number>('POSTGRES_PORT'), // CHANGED: Use explicit port
        username: configService.get<string>('POSTGRES_USER'), // CHANGED: Use explicit username
        password: configService.get<string>('POSTGRES_PASSWORD'), // CHANGED: Use explicit password
        database: configService.get<string>('POSTGRES_DB'), // CHANGED: Use explicit database
        entities: [User], // List all your TypeORM entities here
        synchronize: true, // WARNING: set to false in production and use migrations
        logging: true, // Enable logging for development
      }),
    }),
  ],
  exports: [TypeOrmModule], // Export TypeOrmModule so other modules can use repositories
})
export class DatabaseModule {}