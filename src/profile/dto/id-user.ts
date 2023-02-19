import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export default class IdUserDTO {
  @IsMongoId()
  _id: Types.ObjectId;
}
