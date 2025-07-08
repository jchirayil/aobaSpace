import { Controller, Post, Body, Res, HttpStatus, UnauthorizedException } from '@nestjs/common'; // Import UnauthorizedException
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
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        user: { // Return a simplified user object for the frontend
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
        access_token: 'dummy-jwt-token-abc123', // Keep dummy token for now
        userId: user.id, // Explicitly pass the user ID for frontend use
      });
    } catch (error) {
      // Catch UnauthorizedException from AuthService
      if (error instanceof UnauthorizedException) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
      }
      // Handle other potential errors, casting error to Error to access .message
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: (error as Error).message || 'An unexpected error occurred during login.' });
    }
  }

  @Post('sso-callback')
  async ssoCallback(@Body() ssoData: { provider: string; id: string; email: string }) {
    return this.authService.ssoLogin(ssoData.provider, ssoData.id);
  }
}