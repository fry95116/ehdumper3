/**
 * GalleryModel 用于描述图库的基本信息
 */
export class GalleryModel {
  /** 图库唯一ID */
  public galleryId: string;
  /** EHentai GID */
  public gId: string;
  /** EHentai GHash */
  public gHash: string;
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
}
