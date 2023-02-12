import { IsEmail, IsNotEmpty, IsOptional, IsPort } from 'class-validator';

export class EnvironmentDTO {
  @IsNotEmpty()
  @IsPort()
  PORT: string;

  @IsNotEmpty()
  HOSTNAME: string;

  @IsNotEmpty()
  APP_URI: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  MONGODB_URI: string;

  @IsNotEmpty()
  MONGODB_DB: string;

  @IsNotEmpty()
  @IsEmail()
  MAIL_SMTP_EMAIL: string;

  @IsNotEmpty()
  MAIL_SMTP_PASSWORD: string;

  @IsNotEmpty()
  MAIL_SMTP_HOST: string;

  @IsNotEmpty()
  MAIL_SMTP_DEFAULT_FROM: string;

  @IsOptional()
  @IsNotEmpty()
  TELEGRAM_TOKEN?: string;

  @IsOptional()
  @IsNotEmpty()
  TELEGRAM_GROUP?: string;
}
