import { Inject, Injectable } from '@nestjs/common';
import { PipelineTemplateRepository } from '../repository/pipelineTemplate';
import { PipelineTemplate, PipelineTemplateCreateParams } from '../model/pipelineTemplate';

@Injectable()
export class PipelineTemplateService {
  @Inject()
  private pipeineTemplateRepository: PipelineTemplateRepository;

  async create(params: PipelineTemplateCreateParams) {
    const model = PipelineTemplate.create(params);
    const saved = await this.pipeineTemplateRepository.save(model);
    return saved;
  }

  async delete(params: { pipelineTemplateId: string }) {
    await this.pipeineTemplateRepository.delete(params.pipelineTemplateId);
  }

  findAll() {}
}
