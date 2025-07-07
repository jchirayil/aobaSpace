import { Module, Logger } from '@nestjs/common'; // Import Logger
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as 'postgres', // Explicitly cast to literal type
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [User],
          synchronize: true, // Auto-create tables (for development)
          logging: true, // Enable TypeORM logging
        };
        
        // Log the database configuration for debugging
        Logger.log(`Attempting to connect to database with config:`, 'DatabaseModule');
        Logger.log(`  Host: ${dbConfig.host}`, 'DatabaseModule');
        Logger.log(`  Port: ${dbConfig.port}`, 'DatabaseModule');
        Logger.log(`  User: ${dbConfig.username}`, 'DatabaseModule');
        Logger.log(`  DB: ${dbConfig.database}`, 'DatabaseModule');
        // IMPORTANT: Do NOT log the password directly in production!
        Logger.log(`  Password length: ${dbConfig.password?.length || 0}`, 'DatabaseModule');

        return dbConfig;
      }, // Correct closing for useFactory function body
    }), // Correct closing for TypeOrmModule.forRootAsync options object
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}