import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { constructDTO } from '../../common';
import { toMongoObjectId } from '../../common/transforms/toMongoObjectId';
import { MessageModel } from '../message.model';
import IMessage, { MessageContent, MessageContext, MessageAttachments } from '../interfaces/message.interface';
import { onlyAttachmentFilesPath } from 'common/transforms/onlyAttachmentFilesPath';

export class MessageDTO extends MessageModel implements IMessage {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof IMessage>(this, [
      '_id',
      'content',
      'context',
      'createdAt',
      'updatedAt',
      'senderId',
    ]);
  }
}

export class MessageAttachmentsDTO implements MessageAttachments {
  @IsArray()
  @Transform(onlyAttachmentFilesPath)
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

export class MessageContextDTO implements MessageContext {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  @ApiProperty({ type: String })
  chatId: Types.ObjectId;

  @IsNotEmpty()
  @Transform(toMongoObjectId)
  @ApiProperty({ type: String })
  channelId: Types.ObjectId;
}
