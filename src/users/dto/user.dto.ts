import { UserModel } from '../user.model';
import { createURLtoFile, constructDTO } from '../../common';
import IUser from '../interfaces/user.interface';

export class UserDTO extends UserModel implements IUser {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  getPublic(): Exclude<IUser, 'updatedAt' | 'createdAt' | 'channels'> {
    return constructDTO<this, keyof Exclude<IUser, 'updatedAt' | 'createdAt' | 'channels'>>(
      this,
      ['_id', 'email', 'username', 'tag', 'avatar'],
      {
        mutate: {
          avatar: createURLtoFile,
        },
      },
    );
  }

  getMe(): Exclude<IUser, 'updatedAt'> {
    return constructDTO<this, keyof Exclude<IUser, 'updatedAt'>>(
      this,
      ['_id', 'email', 'username', 'tag', 'avatar', 'createdAt', 'channels'],
      {
        mutate: {
          avatar: createURLtoFile,
          createdAt: (date: Date) => new Date(date).getTime(),
        },
      },
    );
  }
}
