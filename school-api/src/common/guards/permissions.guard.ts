import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator'
import { DEFAULT_ROLE_PERMISSIONS, parsePermissions } from '../permissions'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!required?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('缺少登录信息')
    }

    if (user.role === 'SUPER_ADMIN') {
      return true
    }

    const roleCode = user.role || ''
    let permissions = DEFAULT_ROLE_PERMISSIONS[roleCode] || []

    try {
      const role = await this.prisma.role.findUnique({ where: { code: roleCode } })
      if (role?.status === 'ENABLED') {
        permissions = parsePermissions(role.permissions)
      }
    } catch (error) {
      permissions = DEFAULT_ROLE_PERMISSIONS[roleCode] || []
    }

    const allowed = required.every((item) => permissions.includes(item))

    if (!allowed) {
      throw new ForbiddenException('当前账号无权执行该操作')
    }

    return true
  }
}
