import { Module } from '@nestjs/common';
import { MideaService } from './core/service/media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../../common/config';

@Module({
  imports: [TypeOrmModule.forRoot(getConfig().database)],
  controllers: [],
  providers: [MideaService],
})
export class MediaModule {}
