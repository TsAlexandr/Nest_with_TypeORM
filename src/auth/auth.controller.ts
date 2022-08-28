import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUserId } from '../common/custom-decorator/current.user.decorator';
import { JwtAuthGuards } from './guards/jwt-auth.guards';
import { EmailService } from '../email/email.service';
import { LocalAuthGuards } from './guards/local-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Post('/registration')
  async registration(
    @Body('login') login: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.createUser(login, email, password);
  }

  @Post('/registration-confirmation')
  async confirmClient(@Body() code: string) {
    const confirm = await this.emailService.confirmEmail(code);
    if (!confirm) throw new NotFoundException();
    return null;
  }

  @Post('/registration-email-resending')
  async resendEmail(@Body() email: string) {
    const send = await this.emailService.resendRegistrationCode(email);
    if (!send) throw new BadRequestException();
    return null;
  }
  @UseGuards(LocalAuthGuards)
  @Post('/login')
  async login(
    @Body('login') login: string,
    @Body('password') password: string,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    const result = await this.authService.checkCredentials(login, password);
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.data.accessToken };
  }
  @UseGuards(JwtAuthGuards)
  @Post('/refresh-token')
  async refresh(@Req() req, @Res() res) {
    if (!req.cookie.refreshToken) throw new UnauthorizedException();
    const userId = req.user.id;
    const tokens = await this.authService.createTokens(userId);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('/logout')
  async logout(@Req() req) {
    if (!req.cookie.refreshToken) throw new UnauthorizedException();
    await this.userService.addToken(req.cookies.refreshToken);
    return null;
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
