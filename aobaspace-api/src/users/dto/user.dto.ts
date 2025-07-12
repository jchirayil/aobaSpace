import { IsString, IsEmail, IsOptional, IsBoolean, IsNotEmpty, IsAlphanumeric } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types'; // Import PartialType for DTO inheritance - Moved to top

// DTO for creating a new UserAccount (used internally or by admin)
export class CreateUserAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string; // Can be email or a chosen username

  @IsEmail()
  @IsOptional() // Email might be derived from username if username is email
  email?: string;

  @IsString()
  @IsOptional()
  ssoProvider?: string;

  @IsString()
  @IsOptional()
  ssoId?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

// DTO for updating a UserProfile
export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string; // URL to the avatar image
}

// NEW: DTO for updating a UserPassword (e.g., changing password)
export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string; // Required for changing password

  @IsString()
  @IsNotEmpty()
  newPassword: string; // New password
}

// DTO for creating an Organization
export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}

// DTO for updating an Organization
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

// NEW: DTO for finding a user by email
export class FindUserByEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// DTO for adding a user to an organization
export class AddUserToOrganizationDto {
  @IsString()
  @IsNotEmpty()
  userId: string; // The fixed-length user account ID

  @IsString()
  @IsNotEmpty()
  role: string; // e.g., 'admin', 'member'
}

// NEW: DTO for updating a user's role within an organization
export class UpdateUserOrganizationRoleDto {
  @IsString()
  @IsNotEmpty()
  role: string; // The new role for the user in the organization
}