import { IsNotEmpty, IsUUID } from 'class-validator';
import { IntersectionType } from '@nestjs/mapped-types';
import { PaginationDTO } from '../../common/dto/pagination.dto';

export class GetHistoryDTO extends IntersectionType(PaginationDTO) {
  @IsNotEmpty()
  @IsUUID('4')
  chatId: string;
}
