import { ValidateError } from '../../common/error';
import { assertTruth, uuid } from '../../common/utils';

export interface IGalleryModelCreateParams {
  ehGalleryId: string;
  ehGalleryHash: string;
  url: string;
  name: string;
  nameJp: string;
  type: string;
  uploader: string;
  rating: number;
  length: string;
  language: string;
  sourceUrl: string;
}

export interface IGalleryModelContructorParams {
  galleryId: string;
  ehGalleryId: string;
  ehGalleryHash: string;
  url: string;
  name: string;
  nameJp: string;
  type: string;
  uploader: string;
  rating: number;
  length: string;
  language: string;
  sourceUrl: string;
}

export interface IGalleryModelRestoreParams extends IGalleryModelContructorParams {}
/**
 * GalleryModel 用于描述图库的基本信息
 */
export class GalleryModel {
  /** 图库唯一ID */
  public galleryId: string;
  /** EH Gallery ID */
  public ehGalleryId: string;
  /** EH Gallery Hash */
  public ehGalleryHash: string;
  /** 图库页面URL */
  public url: string;
  /** 图库名称（英文） */
  public name: string;
  /** 图库名称（日文） */
  public nameJp: string;
  /** 图库类型（如 doujinshi、manga 等） */
  public type: string;
  /** 上传者用户名 */
  public uploader: string;
  /** 评分（如 4.5） */
  public rating: number;
  /** 页数 */
  public length: string;
  /** 语言（如 "chinese"、"english"） */
  public language: string;
  /** 采集来源URL */
  public sourceUrl: string;

  protected constructor(params: IGalleryModelContructorParams) {
    this.galleryId = params.galleryId;
    this.ehGalleryId = params.ehGalleryId;
    this.ehGalleryHash = params.ehGalleryHash;
    this.url = params.url;
    this.name = params.name;
    this.nameJp = params.nameJp;
    this.type = params.type;
    this.uploader = params.uploader;
    this.rating = params.rating;
    this.length = params.length;
    this.language = params.language;
    this.sourceUrl = params.sourceUrl;
  }

  static create(params: IGalleryModelCreateParams) {
    GalleryModel.validateCreateParams(params);

    return new GalleryModel({
      galleryId: uuid(),
      ehGalleryId: params.ehGalleryId,
      ehGalleryHash: params.ehGalleryHash,
      url: params.url,
      name: params.name,
      nameJp: params.nameJp || '',
      type: params.type,
      uploader: params.uploader,
      rating: params.rating,
      length: params.length,
      language: params.language,
      sourceUrl: params.sourceUrl,
    });
  }

  private static validateCreateParams(params: IGalleryModelCreateParams) {
    assertTruth(params.ehGalleryId, ValidateError.required('ehGalleryId'));
    assertTruth(params.ehGalleryHash, ValidateError.required('ehGalleryHash'));
    assertTruth(params.url, ValidateError.required('url'));
    assertTruth(params.name, ValidateError.required('name'));
    assertTruth(params.type, ValidateError.required('type'));
    assertTruth(params.uploader, ValidateError.required('uploader'));
    assertTruth(params.rating || params.rating === 0, ValidateError.required('rating'));
    assertTruth(params.length, ValidateError.required('length'));
    assertTruth(params.language, ValidateError.required('language'));
    assertTruth(params.sourceUrl, ValidateError.required('sourceUrl'));
  }

  static restore(params: IGalleryModelContructorParams) {
    assertTruth(params.galleryId, ValidateError.required('galleryId'));
    GalleryModel.validateCreateParams(params);

    return new GalleryModel({
      galleryId: params.galleryId,
      ehGalleryId: params.ehGalleryId,
      ehGalleryHash: params.ehGalleryHash,
      url: params.url,
      name: params.name,
      nameJp: params.nameJp,
      type: params.type,
      uploader: params.uploader,
      rating: params.rating,
      length: params.length,
      language: params.language,
      sourceUrl: params.sourceUrl,
    });
  }
}
