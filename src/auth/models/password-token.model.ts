import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: {} })
export default class PasswordToken {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({})
  @IsString()
  @IsNotEmpty()
  code: string;

  @Prop()
  @IsMongoId()
  @IsNotEmpty()
  idUser: string;

  @Prop({ required: false, default: null })
  @IsDate()
  @IsOptional()
  usedAt: Date;

  @Prop()
  @IsDate()
  @IsNotEmpty()
  expireAt: Date;
}

export const PasswordTokenSchema = SchemaFactory.createForClass(PasswordToken);
export type PasswordTokenDocument = PasswordToken & Document;
