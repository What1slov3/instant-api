import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectIdTransform } from '../../common/transforms/toMongoObjectId.transform';
import IChat from '../interfaces/chat.interface';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDTO implements Pick<IChat, 'name'> {
  @ApiProperty({ minimum: 32, maximum: 3, description: 'Название чата' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name: string;

  @ApiProperty({ description: 'ID группы чатов в который необходимо добавить созданный чат' })
  @IsNotEmpty()
  chatGroupId: string;
}
