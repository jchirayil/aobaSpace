import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { Organization } from '../users/entities/organization.entity'; // Import Organization entity
import { UserOrganization } from '../users/entities/user_organization.entity'; // Import UserOrganization entity

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, UserOrganization]), // Register entities
  ],
  providers: [OrganizationsService],
  controllers: [OrganizationsController],
  exports: [OrganizationsService], // Export service for use in other modules (e.g., AuthModule)
})
export class OrganizationModule {}