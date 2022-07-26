import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('registration')
  async registration(
    @Body() login: string,
    @Body() email: string,
    @Body() password: string,
  ) {
    return await this.userService.createUser(login, email, password);
  }

  @Post('registration-confirmation')
  async confirmClient(@Body() code: string) {
    return await this.authService.confirmEmail(code);
  }

  @Post('registration-email-resending')
  async resendEmail(@Body() email: string) {
    return await this.authService.resendRegistrationCode(email);
  }

  @Post('login')
  async login(
    @Body() login: string,
    @Body() password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.checkCredentials(login, password);
    response.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
  }

  @Post('refresh-token')
  async refresh(@Req() request: Request) {}

  @Post('logout')
  async logout(@Req() request: Request) {
    return await this.userService.addToken(request.cookies.refreshToken);
  }

  @Post('me')
  async infoAboutMe() {}
}
