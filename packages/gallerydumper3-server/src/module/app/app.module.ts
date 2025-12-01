import { Module } from '@nestjs/common';
import { AppController } from './controller/http/app.controller';
import { AppService } from './service/app.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
