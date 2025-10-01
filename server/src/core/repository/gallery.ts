import { Provide } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { GalleryEntity } from "../../dal/entity/galleryEntity";
import { Repository } from "typeorm";
import { GalleryModel } from "../model/gallery";
import { assertTruth } from "../../common/utils";
import { NotFoundError, UpdateDeletedError } from "../../common/error";

@Provide()
export class GalleryRepository {
  @InjectEntityModel(GalleryEntity)
  galleryRepo: Repository<GalleryEntity>;

  async save(model: GalleryModel) {
    const entity = new GalleryEntity();
    entity.galleryId = model.galleryId;
    entity.gId = model.gId;
    entity.gHash = model.gHash;
    entity.url = model.url;
    entity.name = model.name;
    entity.nameJp = model.nameJp;
    entity.type = model.type;
    entity.uploader = model.uploader;
    entity.rating = model.rating;
    entity.length = model.length;
    entity.language = model.language;

    const founded = await this.galleryRepo.findOneBy({
      galleryId: model.galleryId,
    });
    if (!founded) {
      return this.galleryRepo.create(entity);
    }

    assertTruth(
      !founded.deleted_at,
      new UpdateDeletedError("gallery", model.galleryId)
    );
    entity.id = founded.id;
    entity.created_at = founded.created_at;
    entity.updated_at = new Date();
    return this.galleryRepo.save(entity);
  }

  async delete(model: GalleryModel) {
    const founded = await this.galleryRepo.findOneBy({
      galleryId: model.galleryId,
    });
    assertTruth(founded, new NotFoundError("gallery", model.galleryId));
    assertTruth(
      !founded.deleted_at,
      new UpdateDeletedError("gallery", model.galleryId)
    );
    founded.deleted_at = new Date();
    await this.galleryRepo.save(founded);
  }
}
