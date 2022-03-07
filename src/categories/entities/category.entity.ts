import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Category {
  @ApiProperty({ example: '1' })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ example: 'Backend' })
  @Column()
  public name: string;

  @ManyToMany(() => Post, (post: Post) => post.categories)
  public posts: Post[];
}

export default Category;
