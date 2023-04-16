import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import IMessage, { MessageContent, MessageContext } from 'src/messages/interfaces/message.interface';
import { MessageContentDTO, MessageContextDTO } from './message.dto';

export class SendMessageDTO implements Pick<IMessage, 'content' | 'context'> {
  @ValidateNested({ each: true })
  @Type(() => MessageContentDTO)
  @ApiProperty({ type: MessageContentDTO })
  content: MessageContent;

  @ValidateNested({ each: true })
  @Type(() => MessageContextDTO)
  @ApiProperty({ type: MessageContextDTO })
  context: MessageContext;
}
