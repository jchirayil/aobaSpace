import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { OrganizationModule } from '../organizations/organizations.module'; // NEW: Import OrganizationModule

@Module({
  imports: [UsersModule, OrganizationModule], // NEW: Add OrganizationModule
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}