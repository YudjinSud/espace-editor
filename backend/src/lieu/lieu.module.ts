import { Module } from '@nestjs/common';
import { LieuService } from './lieu.service';
import { LieuController } from './lieu.controller';

@Module({
  controllers: [LieuController],
  providers: [LieuService],
  exports: [LieuService],
})
export class LieuModule {}
