import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import IChat from 'chats/interfaces/chat.interface';

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
  @IsUUID('4')
  chatId: string;
}
