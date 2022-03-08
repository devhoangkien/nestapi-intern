import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';

export class CreateTagDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @IsNotEmpty()
  @IsString()
  name: string | null;
}
