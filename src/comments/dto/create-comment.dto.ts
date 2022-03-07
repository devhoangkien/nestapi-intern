import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import ObjectWithIdDTO from 'src/utils/types/object-with-id.type';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../posts/entities/post.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is my comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '11' })
  @Type(() => ObjectWithIdDTO)
  post: ObjectWithIdDTO;
}
