import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { CreateTagDto } from './create-tag.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty({ example: 'JavaScript' })
  @IsNotEmpty()
  @Validate(IsNotExist, ['Tag'], {
    message: 'Tag name already exists',
  })
  @IsString()
  name: string | null;
}
