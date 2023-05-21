import {
  Body,
  Controller,
  Delete,
  Ip,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import RefreshTokenDto from './dto/refresh_token.dto';
import { Request } from 'express';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Req() request: Request,
    @Ip() ip: string,
    @Body() body: LoginDto,
  ) {
    // console.log('Body:: ', body);
    return this.authService.login(body.email, body.password, {
      ipAddress: ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @Post('firebase/login')
  @UseGuards(FirebaseAuthGuard)
  async firebaseLogin(@Req() req: Request) {
    // console.log('Req:: ', req);
    return { user: req.user };
  }

  @Post('refresh') 
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.refresh_token);
  }

  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    return this.authService.logout(body.refresh_token);
  }
}
