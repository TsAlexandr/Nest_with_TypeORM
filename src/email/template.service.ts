import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  getConfirmMessage(confirmationCode: string) {
    return `<a href="https://homework00001.herokuapp.com/auth/registration-confirmation/?code=${confirmationCode}">${confirmationCode}</a>`;
  }
}
