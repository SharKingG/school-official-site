import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

interface ArticleQuery {
  page: number
  pageSize: number
  keyword?: string
  categoryId?: number
  status?: string
  isTop?: boolean
}

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ArticleQuery) {
    const page = Math.max(Number(query.page || 1), 1)
    const pageSize = Math.min(Math.max(Number(query.pageSize || 10), 1), 100)
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { summary: { contains: query.keyword } },
        { content: { contains: query.keyword } }
      ]
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId
    }

    if (query.status) {
      where.status = query.status
    }

    if (query.isTop !== undefined) {
      where.isTop = query.isTop
    }

    const [total, list] = await this.prisma.$transaction([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [
          { isTop: 'desc' },
          { sort: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          creator: {
            select: {
              id: true,
              username: true,
              nickname: true
            }
          }
        }
      })
    ])

    return {
      code: 0,
      message: '获取成功',
      data: {
        list,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    }
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            nickname: true
          }
        },
        files: true
      }
    })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    await this.prisma.article.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    return {
      code: 0,
      message: '获取成功',
      data: article
    }
  }

  async create(dto: CreateArticleDto, creatorId?: number) {
    await this.ensureCategoryExists(dto.categoryId)

    const status = (dto.status as any) || 'DRAFT'

    const article = await this.prisma.article.create({
      data: {
        title: dto.title,
        summary: dto.summary || null,
        content: dto.content,
        categoryId: dto.categoryId,
        author: dto.author || null,
        source: dto.source || null,
        department: dto.department || null,
        type: (dto.type as any) || 'NORMAL',
        status,
        linkUrl: dto.linkUrl || null,
        coverImage: dto.coverImage || null,
        listImage: dto.listImage || null,
        headImage: dto.headImage || null,
        isTop: dto.isTop || false,
        sort: dto.sort || 0,
        publishedAt: this.getPublishedAt(status, dto.publishedAt),
        creatorId: creatorId ? Number(creatorId) : null
      }
    })

    return {
      code: 0,
      message: '创建成功',
      data: article
    }
  }

  async update(id: number, dto: UpdateArticleDto) {
    await this.ensureExists(id)

    if (dto.categoryId) {
      await this.ensureCategoryExists(dto.categoryId)
    }

    const status = dto.status as any

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        title: dto.title,
        summary: dto.summary,
        content: dto.content,
        categoryId: dto.categoryId,
        author: dto.author,
        source: dto.source,
        department: dto.department,
        type: dto.type as any,
        status,
        linkUrl: dto.linkUrl,
        coverImage: dto.coverImage,
        listImage: dto.listImage,
        headImage: dto.headImage,
        isTop: dto.isTop,
        sort: dto.sort,
        publishedAt: status ? this.getPublishedAt(status, dto.publishedAt) : undefined
      }
    })

    return {
      code: 0,
      message: '更新成功',
      data: article
    }
  }

  async updateTop(id: number, isTop: boolean) {
    await this.ensureExists(id)

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        isTop: Boolean(isTop)
      }
    })

    return {
      code: 0,
      message: article.isTop ? '置顶成功' : '取消置顶成功',
      data: article
    }
  }

  async remove(id: number) {
    await this.ensureExists(id)

    await this.prisma.article.delete({
      where: { id }
    })

    return {
      code: 0,
      message: '删除成功',
      data: true
    }
  }

  private async ensureExists(id: number) {
    const article = await this.prisma.article.findUnique({ where: { id } })

    if (!article) {
      throw new NotFoundException('文章不存在')
    }

    return article
  }

  private async ensureCategoryExists(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: Number(categoryId) }
    })

    if (!category) {
      throw new BadRequestException('发布栏目不存在')
    }

    return category
  }

  private getPublishedAt(status?: string, publishedAt?: string) {
    if (publishedAt) {
      return new Date(publishedAt)
    }

    if (status === 'PUBLISHED') {
      return new Date()
    }

    return null
  }
}
