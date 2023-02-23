import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: {}, collection: 'password_tokens' })
export default class PasswordToken {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  code: string;

  @Prop({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  idUser: string;

  @Prop({ type: Date, required: false, default: null })
  @IsDate()
  @IsOptional()
  usedAt: Date | null;

  @Prop({ type: Date, required: true })
  @IsDate()
  @IsNotEmpty()
  expireAt: Date;
}

export const PasswordTokenSchema = SchemaFactory.createForClass(PasswordToken);
export type PasswordTokenDocument = PasswordToken & Document;
