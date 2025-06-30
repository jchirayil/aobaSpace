import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) { // Use DTOs for validation in real app
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) { // Use DTOs for validation in real app
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    // In a real app, generate and return a JWT token here
    return { message: 'Login successful', user };
  }

  @Post('sso-callback')
  async ssoCallback(@Body() ssoData: { provider: string; id: string; email: string }) {
    // This endpoint would typically receive data from your SSO provider's callback
    // or from the frontend after successful SSO authentication.
    return this.authService.ssoLogin(ssoData.provider, ssoData.id);
  }
}