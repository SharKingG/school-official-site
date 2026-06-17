import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLinkDto } from './dto/create-link.dto'
import { UpdateLinkDto } from './dto/update-link.dto'

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { category?: string; status?: string }) {
    const where: any = {}
    if (query.category) where.category = query.category
    if (query.status) where.status = query.status

    const list = await this.prisma.linkItem.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }]
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async findOne(id: number) {
    const item = await this.prisma.linkItem.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('链接不存在')
    return { code: 0, message: '获取成功', data: item }
  }

  async create(dto: CreateLinkDto) {
    const item = await this.prisma.linkItem.create({
      data: {
        name: dto.name,
        url: dto.url,
        category: dto.category || 'QUICK_LINK',
        type: dto.type || 'INTERNAL',
        openTarget: dto.openTarget || 'SELF',
        icon: dto.icon || null,
        sort: dto.sort || 0,
        status: (dto.status as any) || 'ENABLED'
      }
    })
    return { code: 0, message: '创建成功', data: item }
  }

  async update(id: number, dto: UpdateLinkDto) {
    await this.ensureExists(id)
    const item = await this.prisma.linkItem.update({ where: { id }, data: dto as any })
    return { code: 0, message: '更新成功', data: item }
  }

  async remove(id: number) {
    await this.ensureExists(id)
    await this.prisma.linkItem.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  private async ensureExists(id: number) {
    const item = await this.prisma.linkItem.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('链接不存在')
    return item
  }
}
