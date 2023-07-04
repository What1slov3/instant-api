import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
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
  @IsUUID('4')
  systemChatId?: string;

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
  @IsUUID('4')
  channelId: string;
}
