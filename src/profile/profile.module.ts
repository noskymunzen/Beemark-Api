import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from 'src/auth/models/user.model';
import { URLExtractorModule } from 'src/url-extractor/url-extractor.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    URLExtractorModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
