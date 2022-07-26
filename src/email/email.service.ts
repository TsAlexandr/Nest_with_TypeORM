import { MailerService } from '@nestjs-modules/mailer';

export class EmailService {
  constructor(private mailerService: MailerService) {}
  async sendEmail(email: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        from: 'Alex Gerber <process.env.EMAIL_LOGIN>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: message,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
