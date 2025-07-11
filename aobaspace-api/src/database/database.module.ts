import { Module, Logger } from '@nestjs/common'; // Import Logger
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserAccount } from '../users/entities/user_account.entity'; // NEW
import { UserProfile } from '../users/entities/user_profile.entity'; // Corrected '=' to 'from'
import { UserPassword } from '../users/entities/user_password.entity'; // NEW
import { Organization } from '../users/entities/organization.entity'; // NEW
import { UserOrganization } from '../users/entities/user_organization.entity'; // NEW

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as 'postgres', // Explicitly cast to literal type
          host: configService.get<string>('POSTGRES_HOST'), // Get from config
          port: configService.get<number>('POSTGRES_PORT'), // Get from config
          username: configService.get<string>('POSTGRES_USER'), // Get from config
          password: configService.get<string>('POSTGRES_PASSWORD'), // Get from config
          database: configService.get<string>('POSTGRES_DB'), // Get from config
          entities: [
            UserAccount,    // NEW
            UserProfile,    // NEW
            UserPassword,   // NEW
            Organization,   // NEW
            UserOrganization, // NEW
          ],
          synchronize: true, // Auto-create tables (for development)
          logging: true, // Enable TypeORM logging
        };
        
        // Log the database configuration for debugging
        Logger.log(`Attempting to connect to database with config:`, 'DatabaseModule');
        Logger.log(`  Host: ${dbConfig.host}`, 'DatabaseModule');
        Logger.log(`  Port: ${dbConfig.port}`, 'DatabaseModule');
        Logger.log(`  User: ${dbConfig.username}`, 'DatabaseModule');
        // IMPORTANT: Do NOT log the password directly in production!
        Logger.log(`  Password length: ${dbConfig.password?.length || 0}`, 'DatabaseModule');

        return dbConfig;
      }, // Correct closing for useFactory function body
    }), // Corrected closing for TypeOrmModule.forRootAsync options object
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}