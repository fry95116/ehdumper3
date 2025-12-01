import { Module } from '@nestjs/common';
import { MideaService } from './service/media.service';

@Module({
  controllers: [],
  providers: [MideaService],
})
export class MediaModule {}
