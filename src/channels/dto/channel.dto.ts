import { createURLtoFile, constructDTO } from '../../common';
import { ChannelModel } from '../channel.model';
import IChannel from '../interface/channel.interface';

export class ChannelDTO extends ChannelModel implements IChannel {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IChannel, 'updatedAt'>>(
      this,
      ['_id', 'name', 'icon', 'members', 'ownerId', 'chatGroups', 'createdAt', 'systemChatId', 'banner'],
      {
        mutate: {
          icon: createURLtoFile,
        },
      },
    );
  }

  getFromInvite() {
    return constructDTO<this, keyof Exclude<IChannel, 'updatedAt'>>(this, ['_id', 'name', 'icon', 'banner'], {
      add: {
        membersCount: this.members.length,
      },
      mutate: {
        icon: createURLtoFile,
      },
    });
  }
}
