import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express'; // Import Response from express

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      // Return a 401 Unauthorized status for invalid credentials
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }
    // For a successful login, return a dummy access_token for now
    // In a real application, you would generate a JWT here.
    return res.status(HttpStatus.OK).json({ message: 'Login successful', user, access_token: 'dummy-jwt-token-abc123' });
  }

  @Post('sso-callback')
  async ssoCallback(@Body() ssoData: { provider: string; id: string; email: string }) {
    return this.authService.ssoLogin(ssoData.provider, ssoData.id);
  }
}