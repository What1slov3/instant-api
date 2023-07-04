import { ApiProperty } from '@nestjs/swagger';
import { IInvite } from '../interfaces/invites.interface';
import { Types } from 'mongoose';

export class InviteEntity implements Partial<IInvite> {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: String })
  channelId: string;

  @ApiProperty()
  link: string;
}
