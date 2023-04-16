import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import IUser from '../interfaces/user.interface';

export class UserEntity implements IUser {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  channels: Types.ObjectId[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
