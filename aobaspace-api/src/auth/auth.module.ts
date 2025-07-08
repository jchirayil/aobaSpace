import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // Corrected '=' to 'from'
import { UsersModule } from '../users/users.module';
import { OrganizationModule } from '../organizations/organizations.module'; // Corrected path and file name to organizations.module

@Module({
  imports: [UsersModule, OrganizationModule], // NEW: Add OrganizationModule
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}