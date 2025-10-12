export class TagModel {
    /** 标签唯一ID */
    public tagId: string;
    /** 所属图库ID */
    public galleryId: string;
    /** 标签类型（如 "artist"、"character"、"language" 等） */
    public type: string;
    /** 标签名称 */
    public name: string;
    /** 是否为低权重标签 */
    public lowPower: boolean;
}