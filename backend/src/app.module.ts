import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { LieuModule } from './lieu/lieu.module';
import { ElementModule } from './element/element.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LieuModule,
    ElementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
