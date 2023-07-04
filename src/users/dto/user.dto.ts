import { createURLtoFile, constructDTO } from '../../common';
import IUser from '../interfaces/user.interface';
import { UserEntity } from 'users/entities/db/user.entity';

export class UserDTO extends UserEntity implements IUser {
  constructor(data: any) {
    super();
    Object.keys(data).forEach((key) => (this[key] = data[key]));
  }

  getPublic(): Pick<IUser, 'id' | 'username' | 'tag' | 'avatar'> {
    return constructDTO<this, keyof Pick<IUser, 'id' | 'username' | 'tag' | 'avatar'>>(
      this,
      ['id', 'username', 'tag', 'avatar'],
      {
        mutate: {
          avatar: createURLtoFile,
        },
      },
    );
  }

  getMe(extraFields?: Record<string, any>): Exclude<IUser, 'updatedAt'> {
    return constructDTO<this, keyof Exclude<IUser, 'updatedAt'>>(
      this,
      ['id', 'email', 'username', 'tag', 'avatar', 'createdAt'],
      {
        mutate: {
          avatar: createURLtoFile,
          createdAt: (date: Date) => new Date(date).getTime(),
        },
        add: extraFields,
      },
    );
  }
}
