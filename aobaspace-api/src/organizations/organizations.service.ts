import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common"; // NEW: Import UnauthorizedException
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"; // Corrected '=' to 'from'
import { Organization } from "./entities/organization.entity"; // Import Organization entity
import { UserOrganization } from "../users/entities/user-organization.entity"; // Import UserOrganization entity
import { UserAccount } from "../users/entities/user-account.entity"; // NEW: Import UserAccount
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  AddUserToOrganizationDto,
} from "../users/dto/user.dto"; // Import DTOs
import { generateUniqueId } from "../common/utils"; // Import ID generator

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>
  ) {}

  async createOrganization(
    createOrganizationDto: CreateOrganizationDto
  ): Promise<Organization> {
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

  async updateOrganization(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto
  ): Promise<Organization> {
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

  async addUserToOrganization(
    userAccountId: string,
    organizationId: string,
    role: string
  ): Promise<UserOrganization> {
    // Check if the user is already in the organization
    const existingUserOrg = await this.userOrganizationRepository.findOne({
      where: { userAccountId, organizationId },
    });

    if (existingUserOrg) {
      if (existingUserOrg.isActive) {
        throw new UnauthorizedException(
          "User is already an active member of this organization."
        );
      } else {
        // If user was previously inactive, reactivate them and update role
        existingUserOrg.isActive = true;
        existingUserOrg.role = role;
        return this.userOrganizationRepository.save(existingUserOrg);
      }
    }

    const userOrg = this.userOrganizationRepository.create({
      userAccountId,
      organizationId,
      role,
      isActive: true,
    });
    return this.userOrganizationRepository.save(userOrg);
  }

  async removeUserFromOrganization(
    userAccountId: string,
    organizationId: string
  ): Promise<void> {
    // Instead of hard delete, we can set isActive to false
    const result = await this.userOrganizationRepository.update(
      { userAccountId, organizationId },
      { isActive: false, disabledOnDate: new Date() }
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        `User ${userAccountId} not found or not active in organization ${organizationId}`
      );
    }
  }

  async findOrganizationsForUser(
    userAccountId: string
  ): Promise<Organization[]> {
    const userOrgs = await this.userOrganizationRepository.find({
      where: { userAccountId, isActive: true },
      relations: ["organization"], // Load the related Organization entity
    });
    return userOrgs.map((userOrg) => userOrg.organization);
  }

  async findPersonalOrganizationForUser(
    userAccountId: string
  ): Promise<Organization | undefined> {
    const userOrgs = await this.userOrganizationRepository.findOne({
      where: { userAccountId, role: "admin", isActive: true }, // Assuming 'admin' for personal org
      relations: ["organization"],
    });
    // Check if the organization name is consistent with a personal org (e.g., ends with 's Personal Org')
    // This is a heuristic; a dedicated flag on the Organization entity would be more robust.
    if (userOrgs && userOrgs.organization.name.includes("Personal Org")) {
      return userOrgs.organization;
    }
    return undefined;
  }

  /**
   * Retrieves a list of users associated with a specific organization.
   * @param organizationId The ID of the organization.
   * @returns An array of user accounts with their roles in the organization.
   */
  async findUsersInOrganization(organizationId: string): Promise<any[]> {
    const userOrganizations = await this.userOrganizationRepository.find({
      where: { organizationId, isActive: true },
      relations: ["userAccount", "userAccount.profile"], // Eager load user account and profile
    });

    if (!userOrganizations || userOrganizations.length === 0) {
      return [];
    }

    return userOrganizations.map((uo) => ({
      id: uo.userAccount.id,
      username: uo.userAccount.username,
      email: uo.userAccount.email,
      firstName: uo.userAccount.profile?.firstName || null,
      lastName: uo.userAccount.profile?.lastName || null,
      avatarUrl: uo.userAccount.profile?.avatarUrl || null,
      role: uo.role,
      joinedAt: uo.createdAt,
    }));
  }

  /**
   * Updates a user's role within a specific organization.
   * @param organizationId The ID of the organization.
   * @param userAccountId The ID of the user account.
   * @param newRole The new role to assign.
   * @returns The updated UserOrganization entity.
   * @throws NotFoundException if the user is not found in the organization.
   */
  async updateUserOrganizationRole(
    organizationId: string,
    userAccountId: string,
    newRole: string
  ): Promise<UserOrganization> {
    const userOrg = await this.userOrganizationRepository.findOne({
      where: { organizationId, userAccountId, isActive: true },
    });

    if (!userOrg) {
      throw new NotFoundException(
        `User ${userAccountId} not found or not active in organization ${organizationId}`
      );
    }

    userOrg.role = newRole;
    return this.userOrganizationRepository.save(userOrg);
  }
}
