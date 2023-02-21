import { IsOptional, IsString } from 'class-validator';

export default class FindBookmarkAllDTO {
  @IsOptional()
  @IsString()
  search?: string;
}
