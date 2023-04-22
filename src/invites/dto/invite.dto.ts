import { InviteModel } from './../invites.model';
import { constructDTO } from '../../common';
import { IInvite } from '../interfaces/invites.interface';

export class InviteDTO extends InviteModel implements IInvite {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof IInvite>(this, ['_id', 'channelId'], {
      add: {
        link: `${process.env.LOCAL_FRONT_URL}/invites/${this._id}`,
      },
    });
  }
}
