import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(getConfig().database)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
