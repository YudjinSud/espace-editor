import { Module } from '@nestjs/common';
import { ElementService } from './element.service';
import { ElementController } from './element.controller';

@Module({
  controllers: [ElementController],
  providers: [ElementService],
  exports: [ElementService],
})
export class ElementModule {}
