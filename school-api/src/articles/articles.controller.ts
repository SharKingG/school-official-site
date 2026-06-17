import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { ArticlesService } from './articles.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('keyword') keyword = '',
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('isTop') isTop?: string
  ) {
    return this.articlesService.findAll({
      page: Number(page),
      pageSize: Number(pageSize),
      keyword,
      categoryId: categoryId ? Number(categoryId) : undefined,
      status,
      isTop: isTop === undefined ? undefined : isTop === 'true'
    })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateArticleDto, @Req() req: any) {
    return this.articlesService.create(dto, req.user?.sub)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto
  ) {
    return this.articlesService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/top')
  updateTop(
    @Param('id', ParseIntPipe) id: number,
    @Body('isTop') isTop: boolean
  ) {
    return this.articlesService.updateTop(id, isTop)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id)
  }
}
