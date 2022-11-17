import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
  HttpException,
  BadRequestException,
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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { NewPasswordDto } from './dto/newPassword.dto';
import { Request, Response } from 'express';
import { EmailInputDto } from './dto/emailInput.dto';

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
    const user = await this.userService.createUser(registr);
    if (!user)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'code' }] },
        HttpStatus.BAD_REQUEST,
      );
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmClient(@Body('code') code: string) {
    console.log(code, 'code');
    const confirm = await this.emailService.confirmEmail(code);
    console.log(confirm, 'confirm');
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
  async resendEmail(@Body() inputEmail: EmailInputDto) {
    const send = await this.emailService.resendRegistrationCode(
      inputEmail.email,
    );
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
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Headers('user-agent') title: string,
  ) {
    const result = await this.authService.checkCredentials(
      loginBody,
      ip,
      title,
    );
    if (result.resultCode === 1) {
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'refreshToken' }] },
        HttpStatus.UNAUTHORIZED,
      );
    }
    res.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: result.data.accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  async logout(@Res({ passthrough: true }) res: Response, @Cookies() cookies) {
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
  async recoveryPass(@Body() inputEmail: EmailInputDto) {
    console.log(inputEmail, 'email from password recovery');
    await this.emailService.sendRecoveryCode(inputEmail.email);
    return true;
  }

  @UseGuards(ThrottlerGuard)
  @Post('/new-password')
  async getNewPass(@Body() newPasswordDto: NewPasswordDto) {
    console.log(newPasswordDto, 'new password');
    const newPassword = await this.userService.confirmPassword(newPasswordDto);
    if (!newPassword)
      throw new HttpException(
        { message: [{ message: 'invalid value', field: 'recoveryCode' }] },
        HttpStatus.BAD_REQUEST,
      );
    return true;
  }
}
