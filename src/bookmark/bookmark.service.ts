import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { URLExtractorService } from 'src/url-extractor/url-extractor.service';
import CreateBookmarkDTO from './dtos/create-bookmark.dto';
import FindBookmarkAllDTO from './dtos/find-bookmark-all.dto';
import UpdateBookmarkDTO from './dtos/update-bookmark.dto';
import { BookmarkError } from './enums/errors.enum';
import Bookmark, { BookmarkDocument } from './models/bookmark.model';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>,
    private urlExtractorService: URLExtractorService,
  ) {}

  /**
   * Creates a bookmark
   * @param idUser
   * @param createBookmarkDTO request context body
   */
  async create(
    idUser: Types.ObjectId,
    createBookmarkDTO: CreateBookmarkDTO,
  ): Promise<BookmarkDocument> {
    const bookmark = new this.bookmarkModel({
      ...createBookmarkDTO,
      idUser,
      _id: new Types.ObjectId(),
    });
    try {
      const metadata = await this.urlExtractorService.extract(bookmark.url);
      bookmark.excerpt = metadata.description;
      bookmark.imageURL = metadata.image;
      if (!bookmark.title) {
        bookmark.title = metadata.title;
      }
    } finally {
      return bookmark.save();
    }
  }

  /**
   * Finds bookmarks with filter support, based on user
   * @param idUser
   * @param findBookmarkAllDTO request context query params
   */
  findAll(
    idUser: Types.ObjectId,
    findBookmarkAllDTO: FindBookmarkAllDTO,
  ): Promise<BookmarkDocument[]> {
    const query: FilterQuery<BookmarkDocument> = {
      idUser,
      isDelete: false,
    };
    if (findBookmarkAllDTO.search) {
      query.$or = [
        {
          title: new RegExp(findBookmarkAllDTO.search, 'i'),
        },
        {
          url: new RegExp(findBookmarkAllDTO.search, 'i'),
        },
        {
          tags: new RegExp(findBookmarkAllDTO.search, 'i'),
        },
      ];
    }

    return this.bookmarkModel.find(query).exec();
  }

  /**
   * Modifies bookmark's data belonging to the user
   * @param id request context query params
   * @param idUser
   * @param updateBookmarkDTO request context body
   */
  async update(
    id: string,
    idUser: Types.ObjectId,
    updateBookmarkDTO: UpdateBookmarkDTO,
  ): Promise<BookmarkDocument> {
    const bookmark = await this.findBookmarkById(id, idUser);
    if (!bookmark) {
      throw new NotFoundException({
        type: BookmarkError.BookmarkNotFound,
        message: 'Bookmark not found.',
      });
    }
    if (bookmark.isDeleted) {
      throw new NotFoundException({
        type: BookmarkError.BookmarkNotFound,
        message: 'Bookmark not found.',
      });
    }
    bookmark.$set(updateBookmarkDTO);
    return bookmark.save();
  }

  /**
   * Soft deletes bookmark
   * @param id request context query params
   * @param idUser
   */
  async delete(id: string, idUser: Types.ObjectId): Promise<BookmarkDocument> {
    const bookmark = await this.findBookmarkById(id, idUser);
    if (!bookmark) {
      throw new NotFoundException({
        type: BookmarkError.BookmarkNotFound,
        message: 'Bookmark not found.',
      });
    }
    if (bookmark.isDeleted) {
      throw new NotFoundException({
        type: BookmarkError.BookmarkNotFound,
        message: 'Bookmark not found.',
      });
    }
    bookmark.isDeleted = true;
    return bookmark.save();
  }

  /**
   * Finds bookmark by id
   * @param id
   * @param idUser
   */
  async findBookmarkById(
    id: string,
    idUser: Types.ObjectId,
  ): Promise<BookmarkDocument | null> {
    return this.bookmarkModel
      .findOne({
        _id: new Types.ObjectId(id),
        idUser: new Types.ObjectId(idUser),
      })
      .exec();
  }
}
