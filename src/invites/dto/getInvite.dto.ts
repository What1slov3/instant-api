import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { toMongoObjectId } from '../../common';
import { IInvite } from '../interfaces/invites.interface';

export class GetInviteDTO implements Partial<IInvite> {
  @Transform(toMongoObjectId)
  channelId: Types.ObjectId;
}
