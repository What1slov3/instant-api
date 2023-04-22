import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from '../../common/transforms/toMongoObjectId';
import IChannel from '../interface/channel.interface';
import { ApiProperty } from '@nestjs/swagger';

class UpdatableFieldsChannel implements Partial<IChannel> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name?: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  systemChatId?: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  icon?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  banner?: string;
}

export class UpdateChannelDTO extends PartialType(UpdatableFieldsChannel) {}

export class UpdateChannelParamDTO {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  channelId: Types.ObjectId;
}
