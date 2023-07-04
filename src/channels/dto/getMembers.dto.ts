import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { toBooleanTransform } from 'common/transforms/toBoolean.transform';

export class GetChannelMembersDTO {
  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty()
  channelId: string;

  @Transform(toBooleanTransform)
  @ApiProperty()
  withProfiles?: boolean;
}
