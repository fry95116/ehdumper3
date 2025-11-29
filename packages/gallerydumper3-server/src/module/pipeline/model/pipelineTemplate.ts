import { genModelId } from '../../../common/uuid';

export interface PipelineTemplateCreateParams {
  name: string;
  creator: string;
  /** 是否并行 */
  parallel: boolean;
  /** 并行时的并发数 */
  concurrent: number;
  jobs: PipelineJobTemplateVO[];
}

export interface PipelineTemplateRestoreParams extends PipelineTemplateCreateParams {
  createAt: Date;
  pipelineTemplateId: string;
}

export class PipelineTemplate {
  /** 流程模板ID */
  pipelineTemplateId: string;
  /** 流程模板名称 */
  name: string;
  /** 创建时间 */
  createAt: Date;
  /** 创建者 */
  creator: string;
  /** 是否并行 */
  parallel: boolean;
  /** 并行时的并发数 */
  concurrent: number;
  /** 流程模板中的任务列表 */
  jobs: PipelineJobTemplateVO[];

  protected constructor(params: PipelineTemplateRestoreParams) {
    this.pipelineTemplateId = params.pipelineTemplateId;
    this.name = params.name;
    this.createAt = params.createAt;
    this.creator = params.creator;
    this.jobs = params.jobs;
  }

  static create(params: PipelineTemplateCreateParams): PipelineTemplate {
    return new PipelineTemplate({
      pipelineTemplateId: genModelId('PIPELINE_TEMPLATE'),
      name: params.name,
      createAt: new Date(),
      creator: params.creator,
      parallel: params.parallel,
      concurrent: params.concurrent,
      jobs: params.jobs,
    });
  }

  static restore(params: PipelineTemplateRestoreParams): PipelineTemplate {
    return new PipelineTemplate(params);
  }
}

export interface PipelineJobTemplateVO {
  /** 任务名称 */
  name: string;
  /** 任务参数 */
  params: Record<string, TemplateExpressionVO>;
  /** 渲染条件 */
  condition: TemplateExpressionVO;
  /** 循环渲染 */
  loop: TemplateExpressionVO;
  /** 结果作用域 */
  resultScope: string;
  /** 超时时间 */
  timeout: string;
  /** 是否可重试（默认为false） */
  retryable: boolean;
  /** 是否需要手动开始（默认为false） */
  manualStart: boolean;
}

export interface TemplateExpressionVO {
  type: 'string' | 'number' | 'boolean' | 'JSON';
  expression: string;
}
