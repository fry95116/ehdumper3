import { genModelId } from '../../../../common/uuid';

/**
 * 媒体库模型
 * 负责表示一个媒体资源仓库（本地文件系统或远端存储）的元数据。
 */

/**
 * 媒体库类型枚举
 * - LOCAL_FS: 本地文件系统类型的媒体库
 * - REMOTE: 远端/网络存储类型的媒体库
 */
export enum MediaLibraryType {
  LOCAL_FS = 'LOCAL_FS',
  REMOTE = 'remote',
}

/**
 * 创建媒体库时的参数形状
 * - name: 媒体库名称（由用户输入）
 * - type: 媒体库类型（见 MediaLibraryType）
 */
export interface IMediaLibraryCreateParams {
  name: string;
  type: MediaLibraryType;
  rootPath: string;
}

/**
 * 从持久化数据恢复媒体库时的参数形状
 * 扩展自 IMediaLibraryCreateParams，并包含用于还原完整模型所需的字段：
 * - mediaLibraryId: 模型唯一 ID（由 genModelId 生成）
 * - createAt: 创建时间（持久化时保存的时间）
 * - readable: 是否可读
 * - writeable: 是否可写
 */
export interface IMediaLibraryRestoreParams extends IMediaLibraryCreateParams {
  mediaLibraryId: string;
  createAt: Date;
  readable: boolean;
  writeable: boolean;
}

/**
 * MediaLibrary 类
 * 封装媒体库的核心属性与构造逻辑，提供创建(create)与从持久化恢复(restore)两种工厂方法。
 */
export class MediaLibrary {
  /** 模型唯一 ID */
  mediaLibraryId: string;
  /** 创建时间 */
  createAt: Date;
  /** 媒体库名称 */
  name: string;
  /** 媒体库类型 */
  type: MediaLibraryType;
  /** 是否可读取（用于权限/可用性判断） */
  readable: boolean;
  /** 是否可写入（用于权限/可用性判断） */
  writeable: boolean;

  rootPath: string;

  /**
   * 构造函数（通常通过 restore 或 create 工厂方法调用）
   * @param params - 完整的恢复参数，包含 id、时间等元信息
   */
  constructor(params: IMediaLibraryRestoreParams) {
    this.mediaLibraryId = params.mediaLibraryId;
    this.name = params.name;
    this.createAt = params.createAt;
    this.type = params.type;
    this.readable = params.readable;
    this.writeable = params.writeable;
    this.rootPath = params.rootPath;
  }

  /**
   * 创建一个新的 MediaLibrary 实例（用于初次创建）
   * - 会自动生成 mediaLibraryId 与 createAt
   * - 默认 readable / writeable 均为 true
   * @param params - 创建时需要的最小参数
   * @returns 新建的 MediaLibrary 实例
   */
  static create(params: IMediaLibraryCreateParams): MediaLibrary {
    const lib = new MediaLibrary({
      mediaLibraryId: genModelId('MEDIA_LIBRARY'),
      createAt: new Date(),
      name: params.name,
      type: params.type,
      readable: true,
      writeable: true,
      rootPath: params.rootPath,
    });
    return lib;
  }

  /**
   * 从持久化数据恢复 MediaLibrary 实例（例如从数据库读取到的记录）
   * @param params - 从持久化内容恢复所需的完整字段
   * @returns 恢复后的 MediaLibrary 实例
   */
  static restore(params: IMediaLibraryRestoreParams): MediaLibrary {
    return new MediaLibrary(params);
  }
}
