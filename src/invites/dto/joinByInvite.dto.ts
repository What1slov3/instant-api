import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinByInviteDTO {
  @IsNotEmpty()
  @IsUUID('4')
  inviteId: string;
}
