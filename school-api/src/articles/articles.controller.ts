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
import { PermissionsGuard } from '../common/guards/permissions.guard'
import { Permissions } from '../common/decorators/permissions.decorator'
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

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:create')
  @Post()
  create(@Body() dto: CreateArticleDto, @Req() req: any) {
    return this.articlesService.create(dto, req.user)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:manage')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
    @Req() req: any
  ) {
    return this.articlesService.update(id, dto, req.user)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:manage')
  @Patch(':id/top')
  updateTop(
    @Param('id', ParseIntPipe) id: number,
    @Body('isTop') isTop: boolean,
    @Req() req: any
  ) {
    return this.articlesService.updateTop(id, isTop, req.user)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:manage')
  @Patch(':id/submit-review')
  submitReview(@Param('id', ParseIntPipe) id: number, @Body('comment') comment: string, @Req() req: any) {
    return this.articlesService.changeStatus(id, 'PENDING', req.user, '提交审核', comment)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:review')
  @Patch(':id/approve')
  approve(@Param('id', ParseIntPipe) id: number, @Body('comment') comment: string, @Req() req: any) {
    return this.articlesService.changeStatus(id, 'PUBLISHED', req.user, '审核通过', comment)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:review')
  @Patch(':id/reject')
  reject(@Param('id', ParseIntPipe) id: number, @Body('comment') comment: string, @Req() req: any) {
    return this.articlesService.changeStatus(id, 'DRAFT', req.user, '审核驳回', comment)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:review')
  @Patch(':id/offline')
  offline(@Param('id', ParseIntPipe) id: number, @Body('comment') comment: string, @Req() req: any) {
    return this.articlesService.changeStatus(id, 'OFFLINE', req.user, '文章下线', comment)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:manage')
  @Get(':id/review-logs')
  reviewLogs(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findReviewLogs(id)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('article:manage')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.articlesService.remove(id, req.user)
  }
}
