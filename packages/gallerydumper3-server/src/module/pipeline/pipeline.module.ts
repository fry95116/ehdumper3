import { Module } from '@nestjs/common';
import { PipelineTemplateService } from './service/pipelineTemplate.service';
import { PipelineTemplateRepository } from './repository/pipelineTemplate';

@Module({
  controllers: [],
  providers: [PipelineTemplateService, PipelineTemplateRepository],
})
export class PipelineModule {}
