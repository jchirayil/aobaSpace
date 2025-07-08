import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { OrganizationModule } from './organizations/organizations.module'; // Corrected path and file name to organizations.module
import configuration from './config/configuration'; // Import the configuration

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration], // Load our custom configuration
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrganizationModule, // NEW: Add OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}