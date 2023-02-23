import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import User, { UserDocument } from 'src/auth/models/user.model';
import { comparePassword, hashPassword } from 'src/helpers/encrypt.helpers';
import UpdateProfileDTO from './dtos/update-profile.dto';
import { ProfileError } from './enums/errors.enum';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /**
   * Updates user's data
   * @param idUser
   * @param updateProfileDTO
   */
  async updateProfile(
    idUser: Types.ObjectId,
    updateProfileDTO: UpdateProfileDTO,
  ): Promise<User> {
    const user = await this.findUserById(idUser);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found.',
      });
    }
    if (updateProfileDTO.passwords) {
      const passwordsMatch = await comparePassword(
        updateProfileDTO.passwords.currentPassword,
        user.password,
      );
      if (!passwordsMatch) {
        throw new NotFoundException({
          type: ProfileError.CurrentPassIsNotValid,
          message: `Current password is not valid.`,
        });
      }
      user.password = await hashPassword(
        updateProfileDTO.passwords.newPassword,
      );
    }
    const { email = user.email, name = user.name } = updateProfileDTO;

    user.$set({ name, email });
    await user.save();
    return user;
  }

  /**
   * Finds user by id
   * @param id
   */
  async findUserById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();
  }
}
