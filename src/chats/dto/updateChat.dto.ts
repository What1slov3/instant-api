import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from '../../common/transforms/toMongoObjectId';
import IChat from 'chats/interfaces/chat.interface';
import { ApiProperty } from '@nestjs/swagger';

class UpdatableFieldsChat implements Partial<IChat> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name?: string;
}

export class UpdateChatDTO extends PartialType(UpdatableFieldsChat) {}

export class UpdateChatParamDTO {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  chatId: Types.ObjectId;
}
