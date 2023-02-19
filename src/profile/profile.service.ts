import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import User, { UserDocument } from 'src/auth/models/user.model';
import UpdateProfileDTO from './dto/update-profile.dto';
import { ChangePassError } from './enums/errors.enum';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async updateProfile(
    idUser: Types.ObjectId,
    updateProfileDTO: UpdateProfileDTO,
  ): Promise<User> {
    console.log(idUser);
    const user = await this.findUserById(idUser);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found.',
      });
    }
    if (updateProfileDTO.passwords) {
      const passwordsMatch = await this.comparePassword(
        updateProfileDTO.passwords.currentPassword,
        user.password,
      );
      if (!passwordsMatch) {
        throw new NotFoundException({
          type: ChangePassError.CurrentPassIsNotValid,
          message: `Current password is not valid.`,
        });
      }
      user.password = await this.hashPassword(
        updateProfileDTO.passwords.newPassword,
      );
    }
    const { email = user.email, name = user.name } = updateProfileDTO;

    user.$set({ name, email });
    await user.save();
    return user;
  }

  async findUserById(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .exec();
  }
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }
}
