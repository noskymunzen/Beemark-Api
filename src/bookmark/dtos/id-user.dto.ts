import { IsMongoId, IsString } from 'class-validator';

export default class IdUserDTO {
  @IsString()
  @IsMongoId()
  userId: string;
}
