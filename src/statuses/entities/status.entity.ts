import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { StatusEnum } from '../statuses.enum';
@Entity()
export class Status extends EntityHelper {
  @ApiProperty({ example: ' 1' })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ example: 'active' })
  @Allow()
  @Column()
  name?: string;
}
