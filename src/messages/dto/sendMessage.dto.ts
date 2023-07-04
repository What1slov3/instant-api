import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import IMessage, { MessageContent } from '../../messages/interfaces/message.interface';
import { MessageContentDTO } from './message.dto';

export class SendMessageDTO implements Pick<IMessage, 'chatId' | 'content'> {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty()
  chatId: string;

  @ValidateNested({ each: true })
  @Type(() => MessageContentDTO)
  @ApiProperty({ type: MessageContentDTO })
  content: MessageContent;
}
