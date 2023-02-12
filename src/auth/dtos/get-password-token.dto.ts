import { IsString } from 'class-validator';

export default class GetPasswordToken {
  @IsString()
  code: string;
}
