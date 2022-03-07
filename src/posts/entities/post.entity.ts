import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { Role } from '../../users/roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../upload/files/entities/file.entity';
import * as bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { AuthProvidersEnum } from 'src/auth/auth-providers.enum';
import { User } from 'src/users/entities/user.entity';
import Category from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import slugify from 'slugify';

@Entity()
export class Post extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;
  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  @Column('text')
  content: string;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post, {
    eager: true,
  })
  public comments: Comment[] | null;

  @ManyToOne(() => User, (author: User) => author.posts, { eager: true })
  public author: User;

  @Column({ default: 0 })
  viewsCount: number;
  @AfterLoad()
  updateCounters() {
    if (this.viewsCount === undefined) this.viewsCount = 0;
  }

  @ManyToOne(() => Status, {
    eager: true,
  })
  status?: Status;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updateAt: Date;
}
