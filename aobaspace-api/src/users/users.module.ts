import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Import your User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register User entity with TypeORM
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService so it can be used by other modules (e.g., AuthModule)
})
export class UsersModule {}