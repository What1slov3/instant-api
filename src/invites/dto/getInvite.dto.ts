import { IInvite } from '../interfaces/invites.interface';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetInviteDTO implements Partial<IInvite> {
  @IsNotEmpty()
  @IsUUID('4')
  channelId: string;
}
