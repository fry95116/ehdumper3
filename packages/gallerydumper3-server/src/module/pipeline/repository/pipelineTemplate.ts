import { Injectable } from '@nestjs/common';
import { PipelineTemplate } from '../model/pipelineTemplate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PipelineTemplateDO } from '../entity/pipelineTemplate';

export interface Paginate<T> {
  total: number;
  rows: T[];
}

@Injectable()
export class PipelineTemplateRepository {
  constructor(
    @InjectRepository(PipelineTemplateDO)
    private repository: Repository<PipelineTemplateDO>,
  ) {}

  async save(model: PipelineTemplate): Promise<PipelineTemplate> {
    const founded = await this.repository.findOne({
      where: { pipelineTemplateId: model.pipelineTemplateId },
    });
    if (founded) {
      await this.repository.update({ id: founded.id }, model2DO(model));
    }
    await this.repository.insert(model2DO(model));

    const saved = await this.repository.findOne({
      where: { pipelineTemplateId: model.pipelineTemplateId },
    });
    return do2Model(saved);
  }

  async delete(pipelineTemplateId: string) {
    await this.repository.delete({ pipelineTemplateId });
  }

  async findOneById(pipelineTemplateId: string): Promise<PipelineTemplate> {
    const data = await this.repository.findOne({
      where: { pipelineTemplateId },
    });
    return do2Model(data);
  }

  async paginate(page: number, pageSize: number): Promise<Paginate<PipelineTemplate>> {
    const skip = (page - 1) * pageSize;
    const data = await this.repository.find({ skip, take: pageSize });
    const total = await this.repository.count();

    return { rows: data.map(do2Model), total };
  }
}

function model2DO(model: PipelineTemplate): PipelineTemplateDO {
  const data = new PipelineTemplateDO();
  data.pipelineTemplateId = model.pipelineTemplateId;
  data.createAt = model.createAt;
  data.updateAt = new Date();
  data.name = model.name;
  data.creator = model.creator;
  data.content = JSON.stringify({
    parallel: model.parallel,
    concurrent: model.concurrent,
    jobs: model.jobs,
  });

  return data;
}

function do2Model(data: PipelineTemplateDO): PipelineTemplate {
  const contentObj = JSON.parse(data.content);
  const model = PipelineTemplate.restore({
    pipelineTemplateId: data.pipelineTemplateId,
    createAt: data.createAt,
    name: data.name,
    creator: data.creator,
    parallel: contentObj.parallel,
    concurrent: contentObj.concurrent,
    jobs: contentObj.jobs,
  });

  return model;
}
