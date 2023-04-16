import { Transform } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { constructDTO } from 'src/common';
import { toMongoObjectId } from 'src/common/transforms/toMongoObjectId';
import IMessage, { MessageContent, MessageContext } from '../interfaces/message.interface';
import { MessageModel } from '../message.model';
import { ApiProperty } from '@nestjs/swagger';

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

export class MessageContentDTO implements MessageContent {
  @IsNotEmpty()
  @MaxLength(4000)
  @ApiProperty()
  text: string;
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
