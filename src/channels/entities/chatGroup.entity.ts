import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class ChatGroupEntity {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: String })
  chats: Types.ObjectId[];
}
