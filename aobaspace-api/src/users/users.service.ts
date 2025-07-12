import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common'; // NEW: Import NotFoundException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user_account.entity'; // NEW
import { UserProfile } from './entities/user_profile.entity'; // NEW
import { UserPassword } from './entities/user_password.entity'; // NEW
import { generateUniqueId } from '../common/utils'; // NEW: Import ID generator
import * as bcrypt from 'bcryptjs'; // NEW: Import bcrypt for password hashing

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserAccount)
    private userAccountRepository: Repository<UserAccount>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(UserPassword)
    private userPasswordRepository: Repository<UserPassword>,
  ) {}

  // --- UserAccount Operations ---
  async createUserAccount(userData: Partial<UserAccount>): Promise<UserAccount> {
    const userAccountId = generateUniqueId(); // Generate fixed-length ID without prefix
    const newUserAccount = this.userAccountRepository.create({
      id: userAccountId,
      enabledFromDate: new Date(), // Set enabled date on creation
      ...userData,
    });
    return this.userAccountRepository.save(newUserAccount);
  }

  async findUserAccountById(id: string): Promise<UserAccount | undefined> {
    return this.userAccountRepository.findOne({ where: { id } });
  }

  async findUserAccountByUsername(username: string): Promise<UserAccount | undefined> {
    return this.userAccountRepository.findOne({ where: { username } });
  }

  async findOrCreateUserAccountBySso(ssoProvider: string, ssoId: string): Promise<UserAccount> {
    let userAccount = await this.userAccountRepository.findOne({ where: { ssoProvider, ssoId } });
    if (!userAccount) {
      const userAccountId = generateUniqueId(); // Generate fixed-length ID without prefix
      userAccount = this.userAccountRepository.create({
        id: userAccountId,
        username: `${ssoProvider}_${ssoId}`, // Default username for SSO
        email: `${ssoId}@${ssoProvider}.com`, // Default email for SSO
        ssoProvider,
        ssoId,
        isEnabled: true,
        enabledFromDate: new Date(), // Set enabled date on creation
      });
      await this.userAccountRepository.save(userAccount);
    }
    return userAccount;
  }

  // --- UserProfile Operations ---
  async createUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const newUserProfile = this.userProfileRepository.create(profileData);
    return this.userProfileRepository.save(newUserProfile);
  }

  async findUserProfileByAccountId(userAccountId: string): Promise<UserProfile | undefined> {
    return this.userProfileRepository.findOne({ where: { userAccountId } });
  }

  async updateUserProfile(userAccountId: string, updateData: Partial<UserProfile>): Promise<UserProfile | undefined> {
    await this.userProfileRepository.update({ userAccountId }, updateData);
    return this.findUserProfileByAccountId(userAccountId);
  }

  // --- UserPassword Operations ---
  async createUserPassword(passwordData: Partial<UserPassword>): Promise<UserPassword> {
    const newUserPassword = this.userPasswordRepository.create(passwordData);
    return this.userPasswordRepository.save(newUserPassword);
  }

  async findUserPasswordByAccountId(userAccountId: string): Promise<UserPassword | undefined> {
    return this.userPasswordRepository.findOne({ where: { userAccountId } });
  }

  /**
   * Updates a user's password after validating the old password.
   * @param userAccountId The ID of the user account.
   * @param oldPassword The current plain-text password.
   * @param newPassword The new plain-text password.
   * @returns The updated UserPassword entity or undefined if not found/invalid.
   * @throws UnauthorizedException if old password does not match.
   */
  async updateUserPassword(userAccountId: string, oldPassword: string, newPassword: string): Promise<UserPassword | undefined> {
    const userPassword = await this.findUserPasswordByAccountId(userAccountId);

    if (!userPassword || !userPassword.hashedPassword) {
      throw new UnauthorizedException('Password not set for this account or invalid user.');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, userPassword.hashedPassword);

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Old password does not match.');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10); // Hash with salt rounds = 10
    await this.userPasswordRepository.update({ userAccountId }, { hashedPassword: newHashedPassword });
    return this.findUserPasswordByAccountId(userAccountId);
  }

  /**
   * Simulates forcing a password reset for a user by sending an email link.
   * In a real application, this would generate a reset token and send an email.
   * @param userAccountId The ID of the user account.
   * @returns A message indicating the action.
   */
  async forceUserPasswordReset(userAccountId: string): Promise<{ message: string }> {
    const userAccount = await this.findUserAccountById(userAccountId);
    if (!userAccount) {
      throw new NotFoundException(`User with ID "${userAccountId}" not found.`);
    }
    // Dummy implementation: In a real app, generate a token, save it, and send an email.
    console.log(`[DUMMY] Password reset link sent to ${userAccount.email} for user ID: ${userAccountId}`);
    return { message: `Password reset link simulated sent to ${userAccount.email}.` };
  }

  // --- Combined User Data Retrieval (for profile page) ---
  async getFullUserProfile(userAccountId: string): Promise<any> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { id: userAccountId },
      relations: ['profile', 'userOrganizations', 'userOrganizations.organization'], // Eager load profile and organizations
    });

    if (!userAccount) {
      return null;
    }

    // Map userOrganizations to include organization details and user's role
    const organizations = userAccount.userOrganizations.map(uo => ({
      id: uo.organization.id,
      name: uo.organization.name,
      description: uo.organization.description,
      role: uo.role,
      isActive: uo.isActive,
    }));


    return {
      id: userAccount.id,
      username: userAccount.username,
      email: userAccount.email,
      firstName: userAccount.profile?.firstName || null,
      lastName: userAccount.profile?.lastName || null,
      avatarUrl: userAccount.profile?.avatarUrl || null,
      ssoProvider: userAccount.ssoProvider || null,
      ssoId: userAccount.ssoId || null,
      isEnabled: userAccount.isEnabled,
      enabledFromDate: userAccount.enabledFromDate,
      disabledOnDate: userAccount.disabledOnDate,
      createdAt: userAccount.createdAt,
      updatedAt: userAccount.updatedAt,
      organizations: organizations, // Include organizations in the user profile
    };
  }

  // DEPRECATED: This method is insecure as it exposes all users.
  // It has been replaced by the more secure `findUserByEmail` method.
  // public async findAllUserAccounts(): Promise<UserAccount[]> {
  //   return this.userAccountRepository.find();
  // }

  /**
   * Finds a user by email and returns a sanitized version of their data.
   * This is more secure than fetching all users on the frontend.
   * @param email The email of the user to find.
   * @returns A sanitized user object or throws NotFoundException.
   */
  async findUserByEmail(email: string): Promise<Partial<UserAccount>> {
    const userAccount = await this.userAccountRepository.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (!userAccount) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    // Return a sanitized object, suitable for use in invite flows.
    // It intentionally omits sensitive data like password hashes.
    return {
      id: userAccount.id,
      email: userAccount.email,
    };
  }
}