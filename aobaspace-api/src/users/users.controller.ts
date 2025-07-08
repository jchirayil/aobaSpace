import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common'; // Import NotFoundException
import { UsersService } from './users.service';
import { CreateUserAccountDto, UpdateUserProfileDto } from './dto/user.dto'; // NEW: Import DTOs

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint to get a full user profile by ID
  @Get(':id')
  async getFullUserProfile(@Param('id') id: string) {
    const user = await this.usersService.getFullUserProfile(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Endpoint to update a user's profile
  @Put(':id/profile')
  async updateUserProfile(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    const updatedProfile = await this.usersService.updateUserProfile(id, updateUserProfileDto);
    if (!updatedProfile) {
      throw new NotFoundException(`User profile for ID "${id}" not found`);
    }
    return updatedProfile;
  }

  // Note: Standard create, find, update, remove operations for UserAccount
  // are largely handled by AuthService for registration/login.
  // Direct CRUD for UserAccount/UserProfile/UserPassword might be limited
  // to internal admin tools or specific flows.
  // For now, we'll keep the basic findOne and findAll from previous version
  // but they will operate on UserAccount entity.

  // This method would typically be used by an internal admin, not directly by frontend registration
  @Post()
  async createUser(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.usersService.createUserAccount(createUserAccountDto);
  }

  // This finds a user account by its generated ID, not username
  @Get()
  async findAllUserAccounts() {
    // This would typically return all user accounts, might need pagination/filtering
    // For simplicity, returning all for now.
    return this.usersService.findAllUserAccounts(); // Corrected to call public method
  }
}