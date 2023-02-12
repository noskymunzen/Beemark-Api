import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { URLExtractorModule } from 'src/url-extractor/url-extractor.module';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import Bookmark, { BookmarkSchema } from './models/bookmark.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
    URLExtractorModule,
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
