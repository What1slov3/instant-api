import { IsNotEmpty, IsUUID } from 'class-validator';

export class LeaveChannelDTO {
  @IsNotEmpty()
  @IsUUID('4')
  channelId: string;
}
