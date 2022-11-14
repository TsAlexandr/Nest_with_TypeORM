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
  HttpException,
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
import { Request, Response } from 'express';

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmClient(@Body('code') code: string) {
    const confirm = await this.emailService.confirmEmail(code);
    if (!confirm)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'code' }] },
        HttpStatus.BAD_REQUEST,
      );
    return null;
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-email-resending')
  async resendEmail(@Body('email') email: string) {
    console.log(email, 'from controller');
    const send = await this.emailService.resendRegistrationCode(email);
    if (!send)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'email' }] },
        HttpStatus.BAD_REQUEST,
      );
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
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(req.cookies, 'from auth controller refresh token');
    if (!req.cookies.refreshToken) {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.authService.updateDevice(
      req.cookies.refreshToken,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post('/logout')
  async logout(@Res() res, @Cookies() cookies) {
    if (!cookies) {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
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
  async recoveryPass(@Body('email') email: string) {
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
