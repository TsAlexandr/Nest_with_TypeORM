// import { forwardRef, Module } from '@nestjs/common';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { UsersModule } from '../users/users.module';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtAuthGuards } from './guards/jwt-auth.guards';
// import { jwtConstants } from '../../constants';
//
// @Module({
//   controllers: [AuthController],
//   providers: [AuthService, LocalStrategy, JwtAuthGuards],
//   imports: [
//     forwardRef(() => UsersModule),
//     PassportModule,
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: {
//         expiresIn: '10s',
//       },
//     }),
//   ],
//   exports: [AuthService, JwtModule],
// })
// export class AuthModule {}
