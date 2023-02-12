import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { URLExtractorService } from 'src/url-extractor/url-extractor.service';
import CreateBookmarkDTO from './dtos/create-bookmark.dto';
import FindBookmarkAllDTO from './dtos/find-bookmark-all.dto';
import UpdateBookmarkDTO from './dtos/update-bookmark.dto';
import Bookmark, { BookmarkDocument } from './models/bookmark.model';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>,
    private urlExtractorService: URLExtractorService,
  ) {}

  async create(
    idUser: Types.ObjectId,
    createBookmarkDTO: CreateBookmarkDTO,
  ): Promise<BookmarkDocument> {
    const bookmark = new this.bookmarkModel({
      ...createBookmarkDTO,
      idUser,
      _id: new Types.ObjectId(),
    });
    await this.urlExtractorService
      .extract(bookmark.url)
      .then((metadata) => {
        bookmark.excerpt = metadata.description;
        bookmark.imageURL = metadata.image;
        if (!bookmark.title) {
          bookmark.title = metadata.title;
        }
      })
      .catch(() => {});
    return bookmark.save();
  }

  findAll(
    idUser: Types.ObjectId,
    findBookmarkAllDTO: FindBookmarkAllDTO,
  ): Promise<BookmarkDocument[]> {
    if (!findBookmarkAllDTO.search) {
      return this.bookmarkModel
        .find({
          idUser,
          isDeleted: false,
        })
        .exec();
    }
    return this.bookmarkModel
      .find({
        idUser,
        isDeleted: false,
        $or: [
          {
            title: new RegExp(findBookmarkAllDTO.search, 'i'),
          },
          {
            url: new RegExp(findBookmarkAllDTO.search, 'i'),
          },
          {
            tags: new RegExp(findBookmarkAllDTO.search, 'i'),
          },
        ],
      })
      .exec();
  }

  async update(
    id: string,
    idUser: Types.ObjectId,
    updateBookmarkDTO: UpdateBookmarkDTO,
  ): Promise<BookmarkDocument> {
    const bookmark = await this.findBookmarkById(id, idUser);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found.');
    }
    bookmark.$set(updateBookmarkDTO);
    return bookmark.save();
  }

  async deleteModel(
    id: string,
    idUser: Types.ObjectId,
  ): Promise<BookmarkDocument> {
    const bookmark = await this.findBookmarkById(id, idUser);
    if (!bookmark) {
      throw new NotFoundException('Bookmark not found.');
    }
    if (bookmark.isDeleted) {
      throw new NotFoundException('Bookmark was already deleted.');
    }
    bookmark.isDeleted = true;
    return bookmark.save();
  }

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
