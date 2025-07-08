import { Controller, Post, Body, Res, HttpStatus, UnauthorizedException } from '@nestjs/common';
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
    try {
      const user = await this.authService.validateUser(loginDto.username, loginDto.password);
      // For a successful login, return a dummy access_token for now
      // In a real application, you would generate a JWT here.
      return res.status(HttpStatus.OK).json({ message: 'Login successful', user, access_token: 'dummy-jwt-token-abc123' });
    } catch (error) {
      // Catch UnauthorizedException from AuthService
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
      }
      // Handle other potential errors
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred during login.' });
    }
  }

  @Post('sso-callback')
  async ssoCallback(@Body() ssoData: { provider: string; id: string; email: string }) {
    return this.authService.ssoLogin(ssoData.provider, ssoData.id);
  }
}