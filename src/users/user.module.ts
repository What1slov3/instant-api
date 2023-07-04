import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/db/user.entity';
import { ChannelMemberEntity } from 'channels/entities/db/channelMember.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChannelMemberEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
