import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity, ChatGroupEntity, ChatStatEntity } from './entities/db';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, ChatGroupEntity, ChatStatEntity])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
