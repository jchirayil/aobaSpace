import { Injectable, UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException
import { UsersService } from '../users/users.service';
import { OrganizationsService } from '../organizations/organizations.service'; // Corrected path and file name to organizations.service
import * as bcrypt from 'bcryptjs'; // NEW: Import bcryptjs

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService, // NEW: Inject OrganizationsService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const userAccount = await this.usersService.findUserAccountByUsername(username);
    if (!userAccount) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If it's an SSO user, password validation is not applicable
    if (userAccount.ssoProvider) {
      // For SSO users, we might check if the SSO ID is valid,
      // but actual password validation is done by the SSO provider.
      // For now, assume SSO users don't use local password.
      return userAccount;
    }

    const userPassword = await this.usersService.findUserPasswordByAccountId(userAccount.id);

    if (!userPassword || !userPassword.hashedPassword) {
      throw new UnauthorizedException('Password not set for this account');
    }

    // Validate password against hashed password
    const isPasswordValid = await bcrypt.compare(pass, userPassword.hashedPassword);

    if (userAccount && isPasswordValid) {
      // In a real app, you'd return a JWT or session token here.
      // For now, return a simplified user object.
      const userProfile = await this.usersService.findUserProfileByAccountId(userAccount.id);
      return {
        id: userAccount.id,
        username: userAccount.username,
        email: userAccount.email,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
        avatarUrl: userProfile?.avatarUrl,
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async register(userData: { email: string; password?: string }): Promise<any> {
    console.log('Registering user:', userData.email);

    // Check if user already exists
    const existingUser = await this.usersService.findUserAccountByUsername(userData.email);
    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Create UserAccount
    const newUserAccount = await this.usersService.createUserAccount({
      username: userData.email,
      email: userData.email,
      isEnabled: true,
      enabledFromDate: new Date(), // Set enabled date on creation
    });

    // If password is provided, hash and store it
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10); // Hash with salt rounds = 10
      await this.usersService.createUserPassword({
        userAccountId: newUserAccount.id,
        hashedPassword: hashedPassword,
        enabledFromDate: new Date(),
        isActive: true,
      });
    }

    // Create UserProfile (can be empty initially)
    await this.usersService.createUserProfile({
      userAccountId: newUserAccount.id,
      firstName: null, // Can be collected later
      lastName: null, // Can be collected later
      avatarUrl: null, // Can be set later
    });

    // Create a default "Personal" organization for the new user
    const personalOrg = await this.organizationsService.createOrganization({
      name: `${newUserAccount.username}'s Personal Org`, // Unique name for personal org
      isEnabled: true,
      description: 'Your personal workspace.',
    });

    // Link user to their personal organization with 'admin' role
    await this.organizationsService.addUserToOrganization(
      newUserAccount.id,
      personalOrg.id,
      'admin'
    );

    return { message: 'User registered successfully', user: newUserAccount };
  }

  async ssoLogin(ssoProvider: string, ssoId: string): Promise<any> {
    console.log(`SSO Login via ${ssoProvider} for ID: ${ssoId}`);
    const userAccount = await this.usersService.findOrCreateUserAccountBySso(ssoProvider, ssoId);

    // After finding or creating the user account, ensure a profile exists
    let userProfile = await this.usersService.findUserProfileByAccountId(userAccount.id);
    if (!userProfile) {
      userProfile = await this.usersService.createUserProfile({ userAccountId: userAccount.id });
    }

    // Ensure a personal organization exists for SSO users too
    let personalOrg = await this.organizationsService.findPersonalOrganizationForUser(userAccount.id);
    if (!personalOrg) {
      personalOrg = await this.organizationsService.createOrganization({
        name: `${userAccount.username}'s Personal Org`,
        isEnabled: true,
        description: 'Your personal workspace (SSO).',
      });
      await this.organizationsService.addUserToOrganization(userAccount.id, personalOrg.id, 'admin');
    }

    return { message: 'SSO login successful (simulated)', user: userAccount };
  }
}