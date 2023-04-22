import { constructDTO } from '../../common';
import { ChatModel } from '../chat.model';
import IChat from '../interfaces/chat.interface';

export class ChatDTO extends ChatModel implements IChat {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  get() {
    return constructDTO<this, keyof Exclude<IChat, 'updatedAt'>>(this, [
      '_id',
      'owningChannelId',
      'name',
      'createdAt',
      'stats',
    ]);
  }
}
