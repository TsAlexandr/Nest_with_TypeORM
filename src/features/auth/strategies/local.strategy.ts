// import { PassportStrategy } from '@nestjs/passport';
// import { AuthService } from '../auth.service';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { Strategy } from 'passport-local';
// import { LoginDto } from '../dto/login.dto';
//
// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly authService: AuthService) {
//     super({
//       usernameField: 'login',
//     });
//   }
//
//   async validate(loginBody: LoginDto) {
//     const user = await this.authService.checkCredentials(loginBody);
//     if (!user) {
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
