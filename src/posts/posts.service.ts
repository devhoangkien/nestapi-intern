import { Injectable } from '@nestjs/common';
import { CreatePostDto, QueryCommon, QueryPostProperty } from './dto/create-post.dto';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import PostNotFoundException from './exceptions/post-not-found.exception';
import { User } from '../users/entities/user.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { title } from 'process';
import { query } from 'express';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  getPostsWithPagination(paginationOptions: IPaginationOptions) {
    return this.postsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
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

  async searchPosts(seachValue: QueryPostProperty) {
    let res = await this.postsRepository.findAndCount({
      where: `username like '%${seachValue}%' or action like '%${seachValue}%' or ip like '%${seachValue}%'`,
      order: {
        [seachValue.sortField]: seachValue.sortOrder === "descend" ? 'DESC' : 'ASC',
      },
     
    });
    return res;
  }
}
