import { IsNotEmpty, IsUUID } from 'class-validator';

export class KickUserDTO {
  @IsNotEmpty()
  @IsUUID('4')
  channelId: string;

  @IsNotEmpty()
  @IsUUID('4')
  userId: string;
}
