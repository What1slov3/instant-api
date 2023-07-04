import { queryToArrayTransform } from '../../common/transforms/queryToArray.transform';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { toBooleanTransform } from 'common/transforms/toBoolean.transform';

export class GetChannelsDTO {
  @ApiProperty({ type: [String] })
  @Transform(queryToArrayTransform)
  @IsUUID('4', { each: true })
  ids: string[];

  @Transform(toBooleanTransform)
  @ApiProperty()
  withMembers?: boolean;
}
