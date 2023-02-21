import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import User from 'src/auth/models/user.model';
import { RequestWithUser } from 'src/auth/types';
import UpdateProfileDTO from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtGuard)
  @Put('/')
  updateUserData(
    @Req() req: RequestWithUser,
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<User> {
    return this.profileService.updateProfile(req.user._id, updateProfileDTO);
  }
}
