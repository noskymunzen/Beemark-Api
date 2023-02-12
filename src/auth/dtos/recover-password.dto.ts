import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class RecoverPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
