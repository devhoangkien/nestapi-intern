import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Category  from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>, 
		// private readonly categoriesRepository: Repository<Category>
  ) {}
  async create(createPostDto: CreatePostDto) {
    // const category = await this.categoriesRepository.findOne()
    let newPost = await this.postsRepository.create({
			...createPostDto,
    });
    
    return this.postsRepository.save(newPost);
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.postsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getByIds(ids: number[]) {
    return await this.postsRepository.find({
      where: { id: In(ids) },
    });
  }

  async findOne(fields: EntityCondition<Post>) {
    return await this.postsRepository.findOne({
      where: fields,
    });
  }

  update(id: number, updateProfileDto: UpdatePostDto) {
    return this.postsRepository.save(
      this.postsRepository.create({
        id,
        ...updateProfileDto,
      }),
    );
  }

  async softDelete(id: number): Promise<void> {
    await this.postsRepository.softDelete(id);
  }
}
