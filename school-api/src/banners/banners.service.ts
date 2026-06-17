import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { position?: string; status?: string }) {
    const where: any = {}
    if (query.position) where.position = query.position
    if (query.status) where.status = query.status

    const list = await this.prisma.banner.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }]
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async findOne(id: number) {
    const banner = await this.prisma.banner.findUnique({ where: { id } })
    if (!banner) throw new NotFoundException('横幅不存在')
    return { code: 0, message: '获取成功', data: banner }
  }

  async create(dto: CreateBannerDto) {
    const banner = await this.prisma.banner.create({
      data: {
        title: dto.title,
        subtitle: dto.subtitle || null,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl || null,
        position: dto.position || 'HOME_TOP',
        size: dto.size || null,
        sort: dto.sort || 0,
        status: (dto.status as any) || 'ENABLED'
      }
    })
    return { code: 0, message: '创建成功', data: banner }
  }

  async update(id: number, dto: UpdateBannerDto) {
    await this.ensureExists(id)
    const banner = await this.prisma.banner.update({
      where: { id },
      data: {
        title: dto.title,
        subtitle: dto.subtitle,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        position: dto.position,
        size: dto.size,
        sort: dto.sort,
        status: dto.status as any
      }
    })
    return { code: 0, message: '更新成功', data: banner }
  }

  async remove(id: number) {
    await this.ensureExists(id)
    await this.prisma.banner.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  private async ensureExists(id: number) {
    const banner = await this.prisma.banner.findUnique({ where: { id } })
    if (!banner) throw new NotFoundException('横幅不存在')
    return banner
  }
}
