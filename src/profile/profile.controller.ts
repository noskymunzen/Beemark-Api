import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import User from 'src/auth/models/user.model';
import UpdateProfileDTO from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtGuard)
  @Put('/')
  updateUserData(
    @Req() req: Request & { user: User },
    @Body() updateProfileDTO: UpdateProfileDTO,
  ): Promise<User> {
    return this.profileService.updateProfile(req.user._id, updateProfileDTO);
  }
}
