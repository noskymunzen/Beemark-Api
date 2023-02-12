import { IsMongoId, IsString } from 'class-validator';

export default class IdBookmarkDTO {
  @IsString()
  @IsMongoId()
  id: string;
}
