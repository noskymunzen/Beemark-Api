import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import GetPasswordToken from './dtos/get-password-token.dto';
import LoginDTO from './dtos/login.dto';
import RecoverPasswordDTO from './dtos/recover-password.dto';
import ResetPasswordDTO from './dtos/reset-password.dto';
import SignupDTO from './dtos/signup.dto';
import { JwtGuard } from './guards/jwt.guard';
import PasswordToken from './models/password-token.model';
import User from './models/user.model';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() signupDTO: SignupDTO): Promise<User> {
    return this.authService.signup(signupDTO);
  }

  @Post('/login')
  login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
    return this.authService.login(loginDTO);
  }

  @UseGuards(JwtGuard)
  @Get('/me')
  me(@Req() req: Request & { user: User }) {
    return this.authService.findUserById(req.user._id);
  }

  @Post('/recover')
  recoverPassword(
    @Body() recoverPasswordDTO: RecoverPasswordDTO,
  ): Promise<PasswordToken> {
    return this.authService.recoverPassword(recoverPasswordDTO);
  }

  @Post('/reset-password')
  resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO): Promise<void> {
    return this.authService.resetPassword(resetPasswordDTO);
  }

  @Get('/token/:code')
  async getPasswordToken(
    @Param() params: GetPasswordToken,
  ): Promise<PasswordToken> {
    const passwordToken = await this.authService.findPasswordTokenByCode(
      params.code,
    );
    if (!passwordToken) {
      throw new NotFoundException('Password token not found');
    }
    const isValid = this.authService.validatePasswordToken(passwordToken);
    if (!isValid) {
      throw new NotFoundException('Password token expired or used');
    }
    return passwordToken;
  }
}
