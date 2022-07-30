import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { CurrentUserId } from '../custom-decorator/current.user.decorator';
import { JwtAuthGuards } from './guards/jwt-auth.guards';
import { EmailService } from '../email/email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('/registration')
  async registration(
    @Body() login: string,
    @Body() email: string,
    @Body() password: string,
  ) {
    return await this.userService.createUser(login, email, password);
  }

  @Post('/registration-confirmation')
  async confirmClient(@Body() code: string) {
    return await this.emailService.confirmEmail(code);
  }

  @Post('/registration-email-resending')
  async resendEmail(@Body() email: string) {
    return await this.emailService.resendRegistrationCode(email);
  }

  @Post('/login')
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

  @Post('/refresh-token')
  async refresh(@Req() request: Request) {}

  @Post('/logout')
  async logout(@Req() request: Request) {
    return await this.userService.addToken(request.cookies.refreshToken);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/me')
  async infoAboutMe(@CurrentUserId() currentUserId: string) {
    const user = await this.userService.findUserById(currentUserId);
    return {
      userId: user.accountData.id,
      email: user.accountData.email,
      login: user.accountData.login,
    };
  }
}
