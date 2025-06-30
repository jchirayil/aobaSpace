import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api') // Prefix all routes in this controller with /api
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}