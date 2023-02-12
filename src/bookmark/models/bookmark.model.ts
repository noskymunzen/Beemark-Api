import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: {} })
export default class Bookmark {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop()
  @IsMongoId()
  @IsNotEmpty()
  idUser: string;

  @Prop({})
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Prop({})
  @IsString()
  @IsOptional()
  title?: string;

  @Prop({})
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Prop()
  @IsString()
  @IsOptional()
  @IsUrl()
  imageURL?: string;

  @Prop({ default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @Prop({ default: false })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @Prop()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
export type BookmarkDocument = Bookmark & Document;
