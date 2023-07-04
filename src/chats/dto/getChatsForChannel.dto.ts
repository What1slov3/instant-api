import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
export class GetChatsForChannelDTO {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({ type: String })
  channelId: string;
}
