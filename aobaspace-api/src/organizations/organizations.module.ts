import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationsService } from "./organizations.service";
import { OrganizationsController } from "./organizations.controller";
import { Organization } from "./entities/organization.entity"; // Import Organization entity
import { UserOrganization } from "../users/entities/user-organization.entity"; // Import UserOrganization entity
import { UsersModule } from "../users/users.module"; // NEW: Import UsersModule to use UsersService

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, UserOrganization]), // Register entities
    UsersModule, // NEW: Import UsersModule
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService], // Export service for use in other modules (e.g., AuthModule)
})
export class OrganizationModule {}
