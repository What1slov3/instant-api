import { IsNotEmpty, IsUUID } from 'class-validator';
import type { IUser } from 'users/interfaces';

export class KickUserDTO {
  @IsNotEmpty()
  @IsUUID('4')
  channelId: string;

  @IsNotEmpty()
  @IsUUID('4')
  userId: IUser['id'];
}
