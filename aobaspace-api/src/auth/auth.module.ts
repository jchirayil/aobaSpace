import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Auth needs to interact with Users

@Module({
  imports: [UsersModule], // Import UsersModule to use UsersService
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService] // Export AuthService if other modules need to use it
})
export class AuthModule {}