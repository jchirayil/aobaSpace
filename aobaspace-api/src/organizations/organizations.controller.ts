import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common'; // NEW: Import UnauthorizedException
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, AddUserToOrganizationDto, UpdateUserOrganizationRoleDto } from '../users/dto/user.dto'; // Import DTOs, NEW: UpdateUserOrganizationRoleDto

@Controller('api/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    // TODO: Add authentication and authorization check here if only logged-in users can create orgs
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  @Get()
  findAll() {
    // TODO: Add authentication and authorization check here if only admins can view all orgs
    return this.organizationsService.findAllOrganizations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Add authorization check: user must be a member of this organization
    const organization = await this.organizationsService.findOrganizationById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return organization;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    // TODO: Add authorization check: user must be an admin of this organization
    return this.organizationsService.updateOrganization(id, updateOrganizationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // TODO: Add authorization check: user must be an admin of this organization
    return this.organizationsService.deleteOrganization(id);
  }

  @Post(':organizationId/users')
  async addUser(@Param('organizationId') organizationId: string, @Body() addUserDto: AddUserToOrganizationDto) {
    // TODO: Add authorization check: user (making the request) must be an admin of this organization
    // Consider if `addUserDto.userId` should be validated against an existing user account.
    return this.organizationsService.addUserToOrganization(addUserDto.userId, organizationId, addUserDto.role);
  }

  @Delete(':organizationId/users/:userId')
  async removeUser(@Param('organizationId') organizationId: string, @Param('userId') userId: string) {
    // TODO: Add authorization check: user (making the request) must be an admin of this organization
    return this.organizationsService.removeUserFromOrganization(userId, organizationId);
  }

  @Get('user/:userId')
  async findOrganizationsForUser(@Param('userId') userId: string) {
    // TODO: Add authorization check: user (making the request) must be the :userId or an admin
    return this.organizationsService.findOrganizationsForUser(userId);
  }

  // NEW: Endpoint to get a list of users in a specific organization
  @Get(':organizationId/users')
  async findUsersInOrganization(@Param('organizationId') organizationId: string) {
    // TODO: Add authorization check: user (making the request) must be a member of this organization
    return this.organizationsService.findUsersInOrganization(organizationId);
  }

  // NEW: Endpoint to update a user's role within an organization
  @Put(':organizationId/users/:userId/role')
  async updateUserRoleInOrganization(
    @Param('organizationId') organizationId: string,
    @Param('userId') userId: string,
    @Body() updateUserRoleDto: UpdateUserOrganizationRoleDto,
  ) {
    // TODO: Add authorization check: user (making the request) must be an 'admin' of this organization
    // For example:
    // const requestingUser = req.user; // Get current user from request context (after auth guard)
    // const isRequestingUserAdmin = await this.organizationsService.isUserAdminOfOrganization(requestingUser.id, organizationId);
    // if (!isRequestingUserAdmin) {
    //   throw new UnauthorizedException('Only organization administrators can change user roles.');
    // }
    return this.organizationsService.updateUserOrganizationRole(organizationId, userId, updateUserRoleDto.role);
  }
}