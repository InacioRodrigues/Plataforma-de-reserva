import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './loginDto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

}
