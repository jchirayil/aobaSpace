import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, UnauthorizedException } from '@nestjs/common'; // Import NotFoundException, UnauthorizedException
import { UsersService } from './users.service';
import { CreateUserAccountDto, UpdateUserProfileDto, UpdateUserPasswordDto, FindUserByEmailDto } from './dto/user.dto'; // NEW: Import DTOs

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

  // NEW: Endpoint to change user password
  @Put(':id/password')
  async updateUserPassword(@Param('id') id: string, @Body() updateUserPasswordDto: UpdateUserPasswordDto) {
    try {
      const updatedPassword = await this.usersService.updateUserPassword(
        id,
        updateUserPasswordDto.oldPassword,
        updateUserPasswordDto.newPassword
      );
      if (!updatedPassword) {
        throw new NotFoundException(`User password for ID "${id}" not found`);
      }
      return { message: 'Password updated successfully.' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw UnauthorizedException with its message
      }
      throw new UnauthorizedException('Failed to update password.'); // Generic error for others
    }
  }

  // NEW: Endpoint to force a password reset (admin action, sends email link)
  @Post(':id/force-password-reset')
  async forcePasswordReset(@Param('id') id: string) {
    // TODO: Implement actual admin role check here (e.g., using @RolesGuard)
    // if (!req.user.isAdmin) {
    //   throw new UnauthorizedException('Only administrators can force password resets.');
    // }
    return this.usersService.forceUserPasswordReset(id);
  }

  // This method would typically be used by an internal admin, not directly by frontend registration
  @Post()
  async createUser(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.usersService.createUserAccount(createUserAccountDto);
  }

  // DEPRECATED: This endpoint is insecure as it exposes all users.
  // It has been replaced by the more secure `find-by-email` endpoint.
  // @Get()
  // async findAllUserAccounts() {
  //   // This would typically return all user accounts, might need pagination/filtering
  //   // For simplicity, returning all for now.
  //   return this.usersService.findAllUserAccounts();
  // }

  // NEW: Endpoint to find a user by email (for invite flows, etc.)
  // This is a POST to avoid leaking user emails via GET request query params in server logs.
  @Post('find-by-email')
  async findUserByEmail(@Body() findUserByEmailDto: FindUserByEmailDto) {
    // TODO: Add authorization. Only an admin of an organization should be able to look up users.
    // This might be better placed under /api/organizations/:orgId/users/find-by-email
    // For now, any authenticated user can look up another user.
    // The service method will throw a NotFoundException if the user doesn't exist,
    // which is handled automatically by NestJS.
    return this.usersService.findUserByEmail(findUserByEmailDto.email);
  }
}