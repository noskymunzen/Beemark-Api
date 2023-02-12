import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export default class CreateBookmarkDTO {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageURL?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];
}
