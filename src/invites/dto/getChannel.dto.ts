import { IsNotEmpty, IsString, Length } from 'class-validator';

export class GetChannelFromInviteDTO {
  @IsNotEmpty()
  @IsString()
  @Length(Number(process.env.INVITE_LINK_LENGTH))
  inviteId: string;
}
