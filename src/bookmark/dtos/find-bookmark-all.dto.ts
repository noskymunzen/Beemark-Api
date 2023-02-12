import { IsOptional, IsString } from 'class-validator';

export default class FindBookmarkAllDTO {
  // @IsArray()
  // @ValidateNested()
  // @IsString()
  // @IsNotEmpty()
  // tags: string[];

  // @IsString()
  // @IsOptional()
  // title?: string;

  // @IsString()
  // @IsOptional()
  // excerpt?: string;

  // @IsBoolean()
  // @IsOptional()
  // isAvailable?: boolean;

  @IsOptional()
  @IsString()
  search?: string;
}
