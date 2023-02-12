import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsPassword } from '../decorators/is-password.decorator';

@Schema({ timestamps: {} })
export default class User {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({})
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsPassword()
  password: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @IsOptional()
  picture?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
