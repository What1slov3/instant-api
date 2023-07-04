import { ChannelEntity } from 'channels/entities/db/channel.entity';
import { createURLtoFile, constructDTO } from '../../common';
import IChannel from '../interface/channel.interface';

export class ChannelDTO extends ChannelEntity implements IChannel {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get(extraFields?: Record<string, any>) {
    return constructDTO<this, keyof Exclude<IChannel, 'updatedAt'>>(
      this,
      ['id', 'name', 'icon', 'ownerId', 'createdAt', 'systemChatId', 'banner'],
      {
        mutate: {
          icon: createURLtoFile,
          banner: createURLtoFile,
        },
        add: extraFields,
      },
    );
  }

  getFromInvite(extraFields?: Record<string, any>) {
    return constructDTO<this, keyof Exclude<IChannel, 'updatedAt'>>(this, ['id', 'name', 'icon', 'banner'], {
      mutate: {
        icon: createURLtoFile,
        banner: createURLtoFile,
      },
      add: extraFields,
    });
  }
}
