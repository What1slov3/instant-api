import { ChatEntity } from 'chats/entities/chat.entity';
import { constructDTO } from '../../common';
import IChat from '../interfaces/chat.interface';

export class ChatDTO extends ChatEntity implements IChat {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IChat, 'updatedAt'>>(this, ['id', 'name', 'chatGroupId', 'createdAt']);
  }
}
