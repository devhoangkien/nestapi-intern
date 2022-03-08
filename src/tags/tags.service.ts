import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TagNotFoundException from './exceptions/tag-not-found.exception';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  getAllTags() {
    return this.tagsRepository.find({
      relations: ['posts'],
      order: {
        id: 'ASC',
      },
    });
  }

  async getTagById(id: number) {
    const tag = await this.tagsRepository.findOne(id, {
      relations: ['posts'],
    });
    if (tag) {
      return tag;
    }
    throw new TagNotFoundException(id);
  }

  async createTag(tag: CreateTagDto) {
    const newTag = await this.tagsRepository.create(tag);
    await this.tagsRepository.save(newTag);
    return newTag;
  }

  async updateTag(id: number, tag: UpdateTagDto) {
    await this.tagsRepository.update(id, tag);
    const updatedTag = await this.tagsRepository.findOne(id, {
      relations: ['posts'],
    });
    if (updatedTag) {
      return updatedTag;
    }
    throw new TagNotFoundException(id);
  }

  async deleteTag(id: number) {
    const deleteResponse = await this.tagsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new TagNotFoundException(id);
    }
  }
}
