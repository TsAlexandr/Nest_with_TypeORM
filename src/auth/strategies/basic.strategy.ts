import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { basicConstants } from '../../../constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      passReqToCallback: true,
    });
  }
  public validate = async (
    login: string,
    password: string,
  ): Promise<boolean> => {
    if (
      basicConstants.login === login &&
      basicConstants.password === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
