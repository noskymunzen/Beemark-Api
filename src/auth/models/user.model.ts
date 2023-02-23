import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { IsPassword } from '../decorators/is-password.decorator';

@Schema({ timestamps: {} })
export default class User {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ type: String, required: true })
  @IsPassword()
  password: string;
  @Prop({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
