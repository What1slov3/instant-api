import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../users/entities/user.entity';

export class LoginDTO {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  access: string;
}
