import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { addMinutes } from 'date-fns';
import { Model, Types } from 'mongoose';
import LoginDTO from './dtos/login.dto';
import RecoverPasswordDTO from './dtos/recover-password.dto';
import ResetPasswordDTO from './dtos/reset-password.dto';
import SignupDTO from './dtos/signup.dto';
import PasswordToken, {
  PasswordTokenDocument,
} from './models/password-token.model';
import User from './models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(PasswordToken.name)
    private passwordTokenModel: Model<PasswordToken>,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async recoverPassword(
    recoverPasswordDTO: RecoverPasswordDTO,
  ): Promise<PasswordToken> {
    const user = await this.findUserByEmail(recoverPasswordDTO.email);
    if (!user) {
      throw new NotFoundException(`${recoverPasswordDTO.email} not found.`);
    }
    const passwordToken = new this.passwordTokenModel({
      idUser: user._id,
      _id: new Types.ObjectId(),
      expireAt: addMinutes(new Date(), 10),
      code: crypto.randomUUID(),
    });
    const saved = await passwordToken.save();

    const emailLink = this.createAppURL(`/auth/resetpass?code=${saved.code}`);
    void this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAIL_SMTP_DEFAULT_FROM,
        subject: 'Beemark Password recovery',
        html: `<b>Open this <a href="${emailLink}">link</a> to change your password </b>`,
      })
      .catch(() => {});
    return passwordToken;
  }

  private createAppURL(link: string) {
    return `${process.env.APP_URI}/${link}`;
  }

  async signup(signupDTO: SignupDTO): Promise<User> {
    const user = await this.findUserByEmail(signupDTO.email);
    if (user) {
      throw new NotFoundException(`${signupDTO.email} already exists.`);
    }
    const signupUser = new this.userModel({
      _id: new Types.ObjectId(),
      email: signupDTO.email,
      name: signupDTO.name,
      password: await this.hashPassword(signupDTO.password),
    });
    return signupUser.save();
  }

  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await this.findUserByEmail(loginDTO.email);
    if (!user) {
      throw new NotFoundException(`Credentials doesn't match.`);
    }
    const passwordsMatch = await this.comparePassword(
      loginDTO.password,
      user.password,
    );
    if (!passwordsMatch) {
      throw new NotFoundException(`Credentials doesn't match.`);
    }
    return { token: this.generateToken(user) };
  }

  generateToken(user: User) {
    return this.jwtService.sign({
      user,
    });
  }

  validatePasswordToken(passwordToken: PasswordToken): boolean {
    const isExpired = passwordToken.expireAt.getTime() < new Date().getTime();
    return !isExpired && !passwordToken.usedAt;
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const passwordToken = await this.findPasswordTokenByCode(
      resetPasswordDTO.code,
    );
    if (!passwordToken) {
      throw new NotFoundException('Password token not found.');
    }
    const isValid = this.validatePasswordToken(passwordToken);
    if (!isValid) {
      throw new NotFoundException('Password token expired or used');
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(passwordToken.idUser) })
      .exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    user.password = await this.hashPassword(resetPasswordDTO.password);

    passwordToken.usedAt = new Date();

    void this.mailerService
      .sendMail({
        to: user.email,
        from: process.env.MAIL_SMTP_DEFAULT_FROM,
        subject: 'Beemark Password Change',
        html: `<b>Your password has changed</b>`,
      })
      .catch(() => {});

    await Promise.all([user.save(), passwordToken.save()]);
  }

  async findPasswordTokenByCode(
    code: string,
  ): Promise<PasswordTokenDocument | null> {
    return this.passwordTokenModel
      .findOne({
        code,
      })
      .exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
