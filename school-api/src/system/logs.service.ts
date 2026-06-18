import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class LogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { page?: number; pageSize?: number; module?: string; keyword?: string }) {
    const page = Math.max(Number(query.page || 1), 1)
    const pageSize = Math.min(Math.max(Number(query.pageSize || 20), 1), 100)
    const skip = (page - 1) * pageSize
    const where: any = {}

    if (query.module) where.module = query.module

    if (query.keyword) {
      where.OR = [
        { username: { contains: query.keyword } },
        { action: { contains: query.keyword } },
        { description: { contains: query.keyword } },
        { targetType: { contains: query.keyword } }
      ]
    }

    const [total, list] = await this.prisma.$transaction([
      this.prisma.operationLog.count({ where }),
      this.prisma.operationLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          user: {
            select: { id: true, username: true, nickname: true }
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
}
