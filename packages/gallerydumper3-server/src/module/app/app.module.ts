import { Module } from '@nestjs/common';
import { AppController } from './controller/http/app.controller';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../../common/config';

@Module({
  imports: [TypeOrmModule.forRoot(getConfig().database)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
