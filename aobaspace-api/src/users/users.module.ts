import { Module } from "@nestjs/common";
import { UsersService } from "./users.service"; // Corrected '=' to 'from'
import { UsersController } from "./users.controller"; // Corrected '=' to 'from'
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "./entities/user-account.entity"; // NEW
import { UserProfile } from "./entities/user-profile.entity"; // NEW
import { UserPassword } from "./entities/user-password.entity"; // NEW

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserAccount, // NEW
      UserProfile, // NEW
      UserPassword, // NEW
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService for use in other modules (e.g., AuthModule)
})
export class UsersModule {}
