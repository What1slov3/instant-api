import { Types } from 'mongoose';
import IUserPublic from '../interfaces/userPublic.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserPublicEntity implements IUserPublic {
  @ApiProperty()
  _id: Types.ObjectId;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  tag: string;
  
  @ApiProperty()
  avatar: string;
}
