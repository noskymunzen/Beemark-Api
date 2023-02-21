import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/types';
import { BookmarkService } from './bookmark.service';
import CreateBookmarkDTO from './dtos/create-bookmark.dto';
import FindBookmarkAllDTO from './dtos/find-bookmark-all.dto';
import IdBookmarkDTO from './dtos/id-bookmark.dto';
import UpdateBookmarkDTO from './dtos/update-bookmark.dto';
import Bookmark from './models/bookmark.model';

@Controller('/bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(JwtGuard)
  @Post()
  createBookmark(
    @Req() req: RequestWithUser,
    @Body() createBookmarkDTO: CreateBookmarkDTO,
  ): Promise<Bookmark> {
    return this.bookmarkService.create(req.user._id, createBookmarkDTO);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAllBookmarks(
    @Req() req: RequestWithUser,
    @Query() findBookmarkAllDTO: FindBookmarkAllDTO,
  ): Promise<Bookmark[]> {
    return this.bookmarkService.findAll(req.user._id, findBookmarkAllDTO);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateBookmark(
    @Req() req: RequestWithUser,
    @Param() params: IdBookmarkDTO,
    @Body() updateBookmarkDTO: UpdateBookmarkDTO,
  ): Promise<Bookmark> {
    return this.bookmarkService.update(
      params.id,
      req.user._id,
      updateBookmarkDTO,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  daletedBookmark(
    @Req() req: RequestWithUser,
    @Param() params: IdBookmarkDTO,
  ): Promise<Bookmark> {
    return this.bookmarkService.deleteModel(params.id, req.user._id);
  }
}
