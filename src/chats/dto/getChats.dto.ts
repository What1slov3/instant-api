import { queryToArrayTransform } from '../../common/transforms/queryToArray.transform';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetChatsDTO {
  @ApiProperty({ type: [String] })
  @Transform(queryToArrayTransform)
  ids: string[];
}
