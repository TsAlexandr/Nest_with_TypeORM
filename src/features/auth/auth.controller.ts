import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import {
  Cookies,
  CurrentUserId,
} from '../../common/custom-decorator/current.user.decorator';
import { JwtAuthGuards } from './guards/jwt-auth.guards';
import { EmailService } from '../../email/email.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { NewPasswordDto } from './dto/newPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() registr: RegistrationDto) {
    await this.userService.createUser(registr);
    return null;
  }

  @UseGuards(ThrottlerGuard)
  @Post('/registration-confirmation')
  async confirmClient(@Body() code: string) {
    const confirm = await this.emailService.confirmEmail(code);
    if (!confirm) throw new NotFoundException();
    return null;
  }

  @UseGuards(ThrottlerGuard)
  @Post('/registration-email-resending')
  async resendEmail(@Body() email: string) {
    const send = await this.emailService.resendRegistrationCode(email);
    if (!send) throw new BadRequestException();
    return null;
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginBody: LoginDto,
    @Res({ passthrough: true }) res,
    @Ip() ip: string,
    @Headers('user-agent') title: string,
  ) {
    const result = await this.authService.checkCredentials(
      loginBody,
      ip,
      title,
    );
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.data.accessToken };
  }

  @UseGuards(JwtAuthGuards)
  @Post('/refresh-token')
  async refresh(@Req() req, @Res() res, @Cookies() cookies) {
    console.log(cookies);
    if (!cookies) {
      throw new UnauthorizedException();
    }
    const tokens = await this.authService.updateDevice(cookies);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('/logout')
  async logout(@Res() res, @Cookies() cookies) {
    if (!cookies) {
      throw new UnauthorizedException();
    }
    await this.authService.removeSession(cookies);
    res.clearCookie('refreshToken');
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

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/password-recovery')
  async recoveryPass(@Body() email: string) {
    await this.emailService.sendRecoveryCode(email);
    return null;
  }

  @UseGuards(ThrottlerGuard)
  @Post('/new-password')
  async getNewPass(@Body() newPasswordDto: NewPasswordDto) {
    await this.userService.confirmPassword(newPasswordDto);
    return null;
  }
}
