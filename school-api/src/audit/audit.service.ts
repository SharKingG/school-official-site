import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

interface AuditPayload {
  user?: any
  module: string
  action: string
  targetType?: string
  targetId?: number
  description?: string
  result?: string
  ip?: string
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(payload: AuditPayload) {
    try {
      await this.prisma.operationLog.create({
        data: {
          userId: payload.user?.sub ? Number(payload.user.sub) : null,
          username: payload.user?.username || payload.user?.nickname || null,
          module: payload.module,
          action: payload.action,
          targetType: payload.targetType || null,
          targetId: payload.targetId || null,
          description: payload.description || null,
          result: payload.result || 'SUCCESS',
          ip: payload.ip || null
        }
      })
    } catch (error) {
      // 日志不能影响主业务。
    }
  }
}
