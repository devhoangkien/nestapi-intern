import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  MinLength,
  Validate,
} from 'class-validator';
import { Status } from '../../statuses/entities/status.entity';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { Comment } from '../../comments/entities/comment.entity';
import Category  from 'src/categories/entities/category.entity';

export class UpdatePostDto {
  @ApiProperty({ example: 'This is my first post' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This-is-my-first-post' })
  @IsNotEmpty()
  slug: string | null;

  @ApiProperty({
    example:
      'Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity | null;

  @ApiProperty({ type: Category })
  @Validate(IsExist, ['Category', 'id'], {
    message: 'CategoriesNotExists',
  })
  role?: Category | null;

  @ApiProperty({ type: Status })
  @Validate(IsExist, ['Status', 'id'], {
    message: 'statusNotExists',
  })
  status?: Status;
}
