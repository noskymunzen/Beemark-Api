import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsPassword } from 'src/auth/decorators/is-password.decorator';

class UpdatePasswordDTO {
  @IsPassword()
  currentPassword: string;

  @IsPassword()
  newPassword: string;
}

export default class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Type(() => UpdatePasswordDTO)
  @ValidateNested()
  @IsOptional()
  passwords?: UpdatePasswordDTO;
}
