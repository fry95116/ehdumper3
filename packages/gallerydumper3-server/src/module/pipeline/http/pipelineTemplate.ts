import { Controller, Get, Query } from '@nestjs/common';

@Controller('pipelineTemplate')
export class PipelineTemplateController {
  @Get()
  findAll(@Query() pipelineTemplateId: string): string {
    console.log(pipelineTemplateId);
    return 'This action returns all cats';
  }
}
