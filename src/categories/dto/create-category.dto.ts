import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({example: 'Backend'})
  @IsString()
  @IsNotEmpty()
  name: string;
}

export default CreateCategoryDto;