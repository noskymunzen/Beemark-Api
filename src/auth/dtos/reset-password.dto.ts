import { IsNotEmpty, IsString } from 'class-validator';
import { IsPassword } from '../decorators/is-password.decorator';

export default class ResetPasswordDTO {
  @IsPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
