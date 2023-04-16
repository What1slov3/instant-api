import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/transforms/toMongoObjectId';
import IMessage, { MessageContext } from 'src/messages/interfaces/message.interface';
import { MessageContextDTO } from './message.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteMessageDTO implements Pick<IMessage, 'context' | '_id'> {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => MessageContextDTO)
  @ApiProperty({ type: MessageContextDTO })
  context: MessageContext;
}
