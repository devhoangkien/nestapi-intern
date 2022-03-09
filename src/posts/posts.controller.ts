import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import RequestWithUser from '../auth/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/roles/roles.enum';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { QueryPostProperty } from './dto/search-post.dto';

@ApiTags('Posts')
@Controller({
  path: 'posts',
  version: '1',
})
@UseInterceptors(ClassSerializerInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Get all post' })
  @Get('all')
  getAllPosts() {
    return this.postsService.getAllPosts();
  }
  @ApiOperation({ summary: 'Get post with pagination' })
  @Get('search')
  @HttpCode(HttpStatus.OK)
  async getPostsWithPagination(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('keyword') keyword: string,
  ) {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.postsService.getPostsWithPagination({
        page,
        limit,
        keyword,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  getPostById(@Param('id') id: number) {
    return this.postsService.getPostById(Number(id));
  }
  @ApiOperation({ summary: 'Get post by slug' })
  @Get(':slug')
  getPostBySlug(@Param('slug') slug: string) {
    return this.postsService.getPostBySlug(slug);
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiCreatedResponse({ description: 'Post created!' })
  @Post()
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiOkResponse({ description: 'Post Updated!' })
  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() post: UpdatePostDto) {
    return this.postsService.updatePost(Number(id), post);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiOkResponse({ description: 'Post deleted!' })
  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.postsService.deletePost(Number(id));
  }
}
