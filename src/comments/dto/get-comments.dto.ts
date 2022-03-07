import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCommentsDto {
  @Type(() => Number)
  @IsOptional()
  postId?: number;
}
