import { UsersRepository } from '../users/users.repository';
import * as nodemailer from 'nodemailer';

export class EmailService {
  constructor(private usersRepository: UsersRepository) {}
  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_LOGIN,
        pass: process.env.EMAIL_PASS,
      },
    });
    try {
      await transporter.sendMail({
        from: 'Alex Gerber <process.env.EMAIL_LOGIN>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: message,
      });
    } catch (e) {
      console.log(e);
    }
  }

  getConfirmMessage(confirmationCode: string) {
    return `<a href="https://homework00001.herokuapp.com/auth/registration-confirmation/?code=${confirmationCode}">${confirmationCode}</a>`;
  }

  async confirmEmail(code: string) {
    const user = await this.usersRepository.findByConfirmCode(code);
    if (!user) return false;
    if (user.emailConfirm.isConfirmed) return false;
    const dbConfirmCode = user.emailConfirm.confirmationCode;
    if (dbConfirmCode === code) {
      const result = await this.usersRepository.updateConfirm(
        user.accountData.id,
      );
      return result;
    }
    return false;
  }

  async resendRegistrationCode(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return null;
    if (user.emailConfirm.isConfirmed) return null;
    const updUser = await this.usersRepository.updateConfirmationCode(
      user.accountData.id,
    );
    console.log(updUser);
    if (updUser) {
      const message = this.getConfirmMessage(
        updUser.emailConfirm.confirmationCode,
      );
      console.log(message);
      await this.sendEmail(
        updUser.accountData.email,
        'Confirm your email',
        message,
      );
      return true;
    }
    return null;
  }
}
