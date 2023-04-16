import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/transforms/toMongoObjectId';
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

export class GetHistoryDTO extends IntersectionType(PaginationDTO) {
  @IsNotEmpty()
  @Transform(toMongoObjectId)
  @ApiProperty({ type: String })
  chatId: Types.ObjectId;
}
