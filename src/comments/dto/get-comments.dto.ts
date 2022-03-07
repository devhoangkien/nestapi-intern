import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GetCommentsDto {
  @Type(() => Number)
  @IsOptional()
  @ApiProperty()
  postId?: number;
}

export default GetCommentsDto;
