import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { addMinutes } from 'date-fns';
import { Model, Types } from 'mongoose';
import { comparePassword, hashPassword } from 'src/helpers/encrypt.helpers';
import LoginDTO from './dtos/login.dto';
import RecoverPasswordDTO from './dtos/recover-password.dto';
import ResetPasswordDTO from './dtos/reset-password.dto';
import SignupDTO from './dtos/signup.dto';
import { AuthError } from './enums/errors.enum';
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

  /**
   * Creates password token and sends it via email to user based on email
   * @param recoverPasswordDTO request context body
   */
  async recoverPassword(
    recoverPasswordDTO: RecoverPasswordDTO,
  ): Promise<PasswordToken> {
    const user = await this.findUserByEmail(recoverPasswordDTO.email);
    if (!user) {
      throw new NotFoundException({
        type: AuthError.EmailNotExist,
        message: `${recoverPasswordDTO.email} not found.`,
      });
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
        html: `Open this <a href="${emailLink}">link</a> to change your password`,
      })
      .catch(() => {});
    return passwordToken;
  }

  /**
   * Creates a link based on app uri environment variable
   * @param link
   */
  private createAppURL(link: string) {
    return `${process.env.APP_URI}${link}`;
  }

  /**
   * Allows user to register an account
   * @param signupDTO request context body
   */
  async signup(signupDTO: SignupDTO): Promise<User> {
    const user = await this.findUserByEmail(signupDTO.email);
    if (user) {
      throw new NotFoundException({
        type: AuthError.EmailExists,
        message: `${signupDTO.email} already exists.`,
      });
    }
    const signupUser = new this.userModel({
      _id: new Types.ObjectId(),
      email: signupDTO.email,
      name: signupDTO.name,
      password: await hashPassword(signupDTO.password),
    });
    return signupUser.save();
  }

  /**
   * Validates user credentials and generates jwt
   * @param loginDTO request context body
   */
  async login(loginDTO: LoginDTO): Promise<{ token: string }> {
    const user = await this.findUserByEmail(loginDTO.email);
    if (!user) {
      throw new NotFoundException({
        type: AuthError.CredentialsUnmatch,
        message: `Credentials doesn't match.`,
      });
    }
    const passwordsMatch = await comparePassword(
      loginDTO.password,
      user.password,
    );
    if (!passwordsMatch) {
      throw new NotFoundException({
        type: AuthError.CredentialsUnmatch,
        message: `Credentials doesn't match.`,
      });
    }
    return { token: this.generateToken(user) };
  }

  /**
   * Generates jwt based on user data
   * @param user
   */
  generateToken(user: User) {
    return this.jwtService.sign({
      user,
    });
  }

  /**
   * Validates if password token is valid
   * @param passwordToken
   */
  validatePasswordToken(passwordToken: PasswordToken): boolean {
    const isExpired = passwordToken.expireAt.getTime() < new Date().getTime();
    return !isExpired && !passwordToken.usedAt;
  }

  /**
   * Resets password for account recovery
   * @param resetPasswordDTO request context body
   */
  async resetPassword(resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const passwordToken = await this.findPasswordTokenByCode(
      resetPasswordDTO.code,
    );
    if (!passwordToken) {
      throw new NotFoundException({
        type: AuthError.NotFound,
        message: 'Password token not found.',
      });
    }
    const isValid = this.validatePasswordToken(passwordToken);
    if (!isValid) {
      throw new NotFoundException({
        type: AuthError.NotFound,
        message: 'Password token expired or used',
      });
    }
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(passwordToken.idUser) })
      .exec();
    user.password = await hashPassword(resetPasswordDTO.password);

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

  /**
   * Finds password token based on code
   * @param code
   */
  async findPasswordTokenByCode(
    code: string,
  ): Promise<PasswordTokenDocument | null> {
    return this.passwordTokenModel
      .findOne({
        code,
      })
      .exec();
  }

  /**
   * Finds user by id
   * @param id
   */
  async findUserById(id: Types.ObjectId): Promise<User | null> {
    return this.userModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();
  }

  /**
   * Finds user by email
   * @param email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }
}
