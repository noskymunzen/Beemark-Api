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
import User from 'src/auth/models/user.model';
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
    @Req() req: Request & { user: User },
    @Body() createBookmarkDTO: CreateBookmarkDTO,
  ): Promise<Bookmark> {
    return this.bookmarkService.create(req.user._id, createBookmarkDTO);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAllBookmarks(
    @Req() req: Request & { user: User },
    @Query() findBookmarkAllDTO: FindBookmarkAllDTO,
  ): Promise<Bookmark[]> {
    return this.bookmarkService.findAll(req.user._id, findBookmarkAllDTO);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateBookmark(
    @Req() req: Request & { user: User },
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
    @Req() req: Request & { user: User },
    @Param() params: IdBookmarkDTO,
  ): Promise<Bookmark> {
    return this.bookmarkService.deleteModel(params.id, req.user._id);
  }
}
/**
 * los servicios son inyectables y pueden requerir otros servicios
 * los controladores usan servicios
 * los modulos exponen servicios y controladores
 * los modulos inyectan las dependencias de sevicios y controladores
 * los modulos pueden requerir otros modulos
 * sevicios y controladores usan DTOS para validar objetos en diferentes contextos
 *
 *
 * los servicios guardan logica de negocio o cualquier proceso reutilizable
 * los controladores guardan los handlers de endpoint o rutas expuestas(post, get)
 */
