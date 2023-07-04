import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetChannelFromInviteDTO {
  @IsNotEmpty()
  @IsUUID('4')
  inviteId: string;
}
