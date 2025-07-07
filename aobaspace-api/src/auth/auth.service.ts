import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(userData: any): Promise<any> {
    console.log('Registering user:', userData.email);
    const newUser = await this.usersService.create(userData);
    return { message: 'User registered successfully (simulated)', user: newUser };
  }

  async ssoLogin(ssoProvider: string, ssoId: string): Promise<any> {
    console.log(`SSO Login via ${ssoProvider} for ID: ${ssoId}`);
    const user = await this.usersService.findOrCreateBySso(ssoProvider, ssoId);
    return { message: 'SSO login successful (simulated)', user };
  }
}