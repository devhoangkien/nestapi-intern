import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, In, Like, Repository } from 'typeorm';
import PostNotFoundException from './exceptions/post-not-found.exception';
import { User } from '../users/entities/user.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { QueryPostProperty } from './dto/search-post.dto';
import { searchOptions } from 'src/utils/types/search-options';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  getPostsWithPagination(paginationOptions: searchOptions) {
    const condition = [
      {
        title: Like(`%${paginationOptions.keyword}%`),
      },
    ];
    return this.postsRepository.find({
      select: ['id', 'title', 'createdAt'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: condition,
      join: {
        alias: 'post',
        leftJoinAndSelect: {
          tag: 'post.tags',
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id, {
      relations: ['author'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async getPostBySlug(slug: string) {
    const postBySlug = await this.postsRepository.findOne({
      where: { slug: slug },
    });
    if (postBySlug) {
      return postBySlug;
    }
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id, {
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}
