import { MailerService } from '@nestjs-modules/mailer';

export class MailService {
  constructor(private mailerService: MailerService) {}
  sendPasswordRecoveryLink(to: string, emailLink: string) {
    return this.mailerService.sendMail({
      to,
      from: process.env.MAIL_SMTP_EMAIL,
      subject: 'Beemark Password recovery',
      html: `Open this <a href="${emailLink}">link</a> to change your password`,
    });
  }

  sendPasswordChangeConfirm(to: string) {
    return this.mailerService.sendMail({
      to,
      from: process.env.MAIL_SMTP_EMAIL,
      subject: 'Beemark Password Change',
      html: `<b>Your password has changed</b>`,
    });
  }
}
