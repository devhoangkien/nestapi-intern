import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({example:"Template"})
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}

export default UpdateCategoryDto;