import { AuthGuard } from '@nestjs/passport';

export class BasicGuards extends AuthGuard('basic') {}
