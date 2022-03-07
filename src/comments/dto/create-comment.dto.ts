import { Post } from 'src/posts/entities/post.entity';
import { IsString, IsNotEmpty, ValidateNested, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import ObjectWithIdDTO from 'src/utils/types/object-with-id.type';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'great post' })
  content: string;

  @ApiProperty({ example: '11' })
  @ValidateNested()
  @Type(() => Post)
  postId: Post;
}
