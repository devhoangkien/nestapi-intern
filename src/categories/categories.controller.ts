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
import CategoriesService from './categories.service';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/users/roles/roles.decorator';
import { RoleEnum } from 'src/users/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/users/roles/roles.guard';
import FindOneParams from 'src/utils/find-one-params';

@ApiTags('Category')
@Controller({
  path: 'category',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: number) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Post()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategory(category);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
