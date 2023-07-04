import { constructDTO } from '../../common';
import { ChatGroupEntity } from 'chats/entities/db/chatGroup.entity';
import { IChatGroup } from 'chats/interfaces/chatGroup.interface';

export class ChatGroupDTO extends ChatGroupEntity implements IChatGroup {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IChatGroup, 'updatedAt' | 'createdAt'>>(this, [
      'id',
      'name',
      'owningChannelId',
      'chats',
    ]);
  }
}
