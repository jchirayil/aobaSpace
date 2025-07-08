import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user_account.entity'; // NEW
import { UserProfile } from './entities/user_profile.entity'; // NEW
import { UserPassword } from './entities/user_password.entity'; // NEW
import { generateUniqueId } from '../common/utils'; // NEW: Import ID generator

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

  async updateUserPassword(userAccountId: string, updateData: Partial<UserPassword>): Promise<UserPassword | undefined> {
    await this.userPasswordRepository.update({ userAccountId }, updateData);
    return this.findUserPasswordByAccountId(userAccountId);
  }

  // --- Combined User Data Retrieval (for profile page) ---
  async getFullUserProfile(userAccountId: string): Promise<any> {
    const userAccount = await this.findUserAccountById(userAccountId);
    if (!userAccount) {
      return null;
    }
    const userProfile = await this.findUserProfileByAccountId(userAccountId);

    return {
      id: userAccount.id,
      username: userAccount.username,
      email: userAccount.email,
      firstName: userProfile?.firstName || null,
      lastName: userProfile?.lastName || null,
      avatarUrl: userProfile?.avatarUrl || null,
      ssoProvider: userAccount.ssoProvider || null,
      ssoId: userAccount.ssoId || null,
      isEnabled: userAccount.isEnabled,
      enabledFromDate: userAccount.enabledFromDate, // Include enabledFromDate
      disabledOnDate: userAccount.disabledOnDate,   // Include disabledOnDate
      createdAt: userAccount.createdAt,
      updatedAt: userAccount.updatedAt,
    };
  }

  // Public method to retrieve all user accounts
  public async findAllUserAccounts(): Promise<UserAccount[]> { // Added explicit 'public'
    return this.userAccountRepository.find();
  }
}