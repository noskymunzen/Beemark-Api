import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: {} })
export default class Bookmark {
  @Prop({ type: Types.ObjectId })
  @IsMongoId()
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  idUser: string;

  @Prop({ type: String, requeried: true })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Prop({ type: String, requeried: false })
  @IsString()
  @IsOptional()
  title?: string;

  @Prop({ type: String, requeried: false })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @Prop({ type: String, requeried: false })
  @IsString()
  @IsOptional()
  @IsUrl()
  imageURL?: string;

  @Prop({ type: Boolean, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @Prop({ type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
export type BookmarkDocument = Bookmark & Document;
