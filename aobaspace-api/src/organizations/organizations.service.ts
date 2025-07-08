import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../users/entities/organization.entity'; // Import Organization entity
import { UserOrganization } from '../users/entities/user_organization.entity'; // Import UserOrganization entity
import { CreateOrganizationDto, UpdateOrganizationDto } from '../users/dto/user.dto'; // Import DTOs
import { generateUniqueId } from '../common/utils'; // Import ID generator

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,
  ) {}

  async createOrganization(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organizationId = generateUniqueId(); // Generate fixed-length ID without prefix
    const newOrganization = this.organizationRepository.create({
      id: organizationId,
      ...createOrganizationDto,
    });
    return this.organizationRepository.save(newOrganization);
  }

  async findAllOrganizations(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }

  async findOrganizationById(id: string): Promise<Organization | undefined> {
    return this.organizationRepository.findOne({ where: { id } });
  }

  async updateOrganization(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOrganizationById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    await this.organizationRepository.update(id, updateOrganizationDto);
    return this.findOrganizationById(id); // Return updated entity
  }

  async deleteOrganization(id: string): Promise<void> {
    const result = await this.organizationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
  }

  async addUserToOrganization(userAccountId: string, organizationId: string, role: string): Promise<UserOrganization> {
    const userOrg = this.userOrganizationRepository.create({
      userAccountId,
      organizationId,
      role,
      isActive: true,
    });
    return this.userOrganizationRepository.save(userOrg);
  }

  async removeUserFromOrganization(userAccountId: string, organizationId: string): Promise<void> {
    const result = await this.userOrganizationRepository.delete({ userAccountId, organizationId });
    if (result.affected === 0) {
      throw new NotFoundException(`User ${userAccountId} not found in organization ${organizationId}`);
    }
  }

  async findOrganizationsForUser(userAccountId: string): Promise<Organization[]> {
    const userOrgs = await this.userOrganizationRepository.find({
      where: { userAccountId, isActive: true },
      relations: ['organization'], // Load the related Organization entity
    });
    return userOrgs.map(userOrg => userOrg.organization);
  }

  async findPersonalOrganizationForUser(userAccountId: string): Promise<Organization | undefined> {
    const userOrgs = await this.userOrganizationRepository.findOne({
      where: { userAccountId, role: 'admin' }, // Assuming 'admin' for personal org
      relations: ['organization'],
    });
    // Check if the organization name is consistent with a personal org (e.g., ends with 's Personal Org')
    // This is a heuristic; a dedicated flag on the Organization entity would be more robust.
    if (userOrgs && userOrgs.organization.name.includes('Personal Org')) {
      return userOrgs.organization;
    }
    return undefined;
  }
}