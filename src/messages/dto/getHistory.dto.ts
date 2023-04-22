import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IntersectionType } from '@nestjs/mapped-types';
import { toMongoObjectId } from '../../common/transforms/toMongoObjectId';
import { PaginationDTO } from '../../common/dto/pagination.dto';

export class GetHistoryDTO extends IntersectionType(PaginationDTO) {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  @ApiProperty({ type: String })
  chatId: Types.ObjectId;
}
