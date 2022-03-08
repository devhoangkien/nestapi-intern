import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Put,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/users/roles/roles.decorator';
import { RoleEnum } from 'src/users/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/users/roles/roles.guard';
import FindOneParams from 'src/utils/find-one-params';

@ApiTags('Tags')
@Controller({
  path: 'tag',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  @Get(':id')
  getTagById(@Param('id') id: number) {
    return this.tagsService.getTagById(Number(id));
  }

  @Post()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createTag(@Body() tag: CreateTagDto) {
    return this.tagsService.createTag(tag);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateTag(@Param('id') id: number, @Body() tag: UpdateTagDto) {
    return this.tagsService.updateTag(Number(id), tag);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteTag(@Param('id') id: number) {
    return this.tagsService.deleteTag(Number(id));
  }
}
