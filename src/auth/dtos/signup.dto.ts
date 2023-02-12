import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '../decorators/is-password.decorator';

export default class SignupDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
