import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, AddUserToOrganizationDto } from '../users/dto/user.dto'; // Import DTOs

@Controller('api/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.createOrganization(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAllOrganizations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const organization = await this.organizationsService.findOrganizationById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return organization;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.updateOrganization(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationsService.deleteOrganization(id);
  }

  @Post(':organizationId/users')
  addUser(@Param('organizationId') organizationId: string, @Body() addUserDto: AddUserToOrganizationDto) {
    return this.organizationsService.addUserToOrganization(addUserDto.userId, organizationId, addUserDto.role);
  }

  @Delete(':organizationId/users/:userId')
  removeUser(@Param('organizationId') organizationId: string, @Param('userId') userId: string) {
    return this.organizationsService.removeUserFromOrganization(userId, organizationId);
  }

  @Get('user/:userId')
  findOrganizationsForUser(@Param('userId') userId: string) {
    return this.organizationsService.findOrganizationsForUser(userId);
  }
}