import { IsArray, MaxLength, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import IMessage, { MessageAttachments, MessageContent } from 'messages/interfaces/message.interface';
import { constructDTO } from '../../common';
import { MessageModel } from 'messages/message.model';
import { onlyAttachmentFilesPathTransform } from 'common/transforms/onlyAttachmentFilesPath.transform';

export class MessageDTO extends MessageModel implements IMessage {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof IMessage>(
      this,
      ['_id', 'createdAt', 'content', 'chatId', 'updatedAt', 'senderId', 'meta'],
      { mutateFieldName: { _id: 'id' } },
    );
  }
}

export class MessageAttachmentsDTO implements MessageAttachments {
  @IsArray()
  @Transform(onlyAttachmentFilesPathTransform)
  @ApiProperty({ type: [String] })
  files?: string[];
}

export class MessageContentDTO implements MessageContent {
  @MaxLength(4000)
  @ApiProperty()
  text: string;

  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentsDTO)
  @ApiProperty()
  attachments: MessageAttachmentsDTO;
}
