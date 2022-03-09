import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterLoad,
  AfterInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import appConfig from '../../config/app.config';

@Entity({ name: 'file' })
export class FileEntity extends EntityHelper {
  @ApiProperty({ example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @Column()
  @ApiProperty({ example: 'public\\c88a184a-0cc6-413a-8f45-8ed791248c9c.jpg' })
  path: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.indexOf('/') === 0) {
      this.path = appConfig().backendDomain + this.path;
    }
  }
}
