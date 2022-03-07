import {
  Column,
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class Tag extends EntityHelper {
  @ApiProperty({ example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @Allow()
  @ApiProperty({ example: 'TypeScript' })
  @Column({ unique: true, nullable: true })
  name?: string;

  @ManyToMany(() => Post, (post) => post.tags)
  @JoinColumn({ name: 'post_id' })
  posts: Post[];
}
