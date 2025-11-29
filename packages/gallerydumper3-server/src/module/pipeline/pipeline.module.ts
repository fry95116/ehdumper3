import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../../common/config';
import { PipelineTemplateService } from './service/pipelineTemplate.service';
import { PipelineTemplateRepository } from './repository/pipelineTemplate';
import { PipelineTemplateDO } from './entity/pipelineTemplate';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...getConfig().database,
      entities: [PipelineTemplateDO],
    }),
  ],
  controllers: [],
  providers: [PipelineTemplateService, PipelineTemplateRepository],
})
export class PipelineModule {}
