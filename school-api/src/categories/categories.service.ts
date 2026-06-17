import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.category.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }],
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            articles: true,
            children: true
          }
        }
      }
    })

    return {
      code: 0,
      message: '获取成功',
      data: list
    }
  }

  async findTree() {
    const list = await this.prisma.category.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }]
    })

    const map = new Map<number, any>()
    const roots: any[] = []

    for (const item of list) {
      map.set(item.id, { ...item, children: [] })
    }

    for (const item of map.values()) {
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId).children.push(item)
      } else {
        roots.push(item)
      }
    }

    return {
      code: 0,
      message: '获取成功',
      data: roots
    }
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true
      }
    })

    if (!category) {
      throw new NotFoundException('栏目不存在')
    }

    return {
      code: 0,
      message: '获取成功',
      data: category
    }
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId }
      })

      if (!parent) {
        throw new BadRequestException('上级栏目不存在')
      }
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId || null,
        sort: dto.sort || 0,
        status: (dto.status as any) || 'ENABLED',
        type: dto.type || 'ARTICLE',
        path: dto.path || null
      }
    })

    return {
      code: 0,
      message: '创建成功',
      data: category
    }
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.ensureExists(id)

    if (dto.parentId === id) {
      throw new BadRequestException('上级栏目不能选择自己')
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId }
      })

      if (!parent) {
        throw new BadRequestException('上级栏目不存在')
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        parentId: dto.parentId === undefined ? undefined : dto.parentId || null,
        sort: dto.sort,
        status: dto.status as any,
        type: dto.type,
        path: dto.path
      }
    })

    return {
      code: 0,
      message: '更新成功',
      data: category
    }
  }

  async remove(id: number) {
    await this.ensureExists(id)

    const childrenCount = await this.prisma.category.count({
      where: { parentId: id }
    })

    if (childrenCount > 0) {
      throw new BadRequestException('该栏目存在下级栏目，不能删除')
    }

    const articleCount = await this.prisma.article.count({
      where: { categoryId: id }
    })

    if (articleCount > 0) {
      throw new BadRequestException('该栏目下存在文章，不能删除')
    }

    await this.prisma.category.delete({
      where: { id }
    })

    return {
      code: 0,
      message: '删除成功',
      data: true
    }
  }

  private async ensureExists(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } })

    if (!category) {
      throw new NotFoundException('栏目不存在')
    }

    return category
  }
}
