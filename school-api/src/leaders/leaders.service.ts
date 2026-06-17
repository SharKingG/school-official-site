import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLeaderDto } from './dto/create-leader.dto'
import { UpdateLeaderDto } from './dto/update-leader.dto'

@Injectable()
export class LeadersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    const where: any = {}
    if (status) where.status = status
    const list = await this.prisma.leader.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }]
    })
    return { code: 0, message: '获取成功', data: list }
  }

  async findOne(id: number) {
    const item = await this.prisma.leader.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('领导信息不存在')
    return { code: 0, message: '获取成功', data: item }
  }

  async create(dto: CreateLeaderDto) {
    const item = await this.prisma.leader.create({
      data: {
        name: dto.name,
        title: dto.title,
        photo: dto.photo || null,
        intro: dto.intro || null,
        sort: dto.sort || 0,
        status: (dto.status as any) || 'ENABLED'
      }
    })
    return { code: 0, message: '创建成功', data: item }
  }

  async update(id: number, dto: UpdateLeaderDto) {
    await this.ensureExists(id)
    const item = await this.prisma.leader.update({
      where: { id },
      data: {
        name: dto.name,
        title: dto.title,
        photo: dto.photo,
        intro: dto.intro,
        sort: dto.sort,
        status: dto.status as any
      }
    })
    return { code: 0, message: '更新成功', data: item }
  }

  async remove(id: number) {
    await this.ensureExists(id)
    await this.prisma.leader.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  private async ensureExists(id: number) {
    const item = await this.prisma.leader.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('领导信息不存在')
    return item
  }
}
