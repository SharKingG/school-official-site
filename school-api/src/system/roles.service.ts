import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ALL_PERMISSIONS, PERMISSION_LABELS, stringifyPermissions, parsePermissions } from '../common/permissions'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.role.findMany({
      orderBy: [{ sort: 'asc' }, { id: 'asc' }]
    })

    return {
      code: 0,
      message: '获取成功',
      data: list.map((item) => ({
        ...item,
        permissions: parsePermissions(item.permissions)
      }))
    }
  }

  findPermissions() {
    return {
      code: 0,
      message: '获取成功',
      data: {
        all: ALL_PERMISSIONS,
        labels: PERMISSION_LABELS
      }
    }
  }

  async create(dto: CreateRoleDto, user?: any) {
    const exists = await this.prisma.role.findUnique({ where: { code: dto.code } })
    if (exists) throw new BadRequestException('角色编码已存在')

    const role = await this.prisma.role.create({
      data: {
        code: dto.code.trim().toUpperCase(),
        name: dto.name.trim(),
        description: dto.description || null,
        permissions: stringifyPermissions(dto.permissions || []),
        sort: dto.sort || 0,
        status: (dto.status as any) || 'ENABLED'
      }
    })

    return { code: 0, message: '创建成功', data: { ...role, permissions: parsePermissions(role.permissions) } }
  }

  async update(id: number, dto: UpdateRoleDto) {
    const exists = await this.prisma.role.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('角色不存在')

    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        permissions: dto.permissions ? stringifyPermissions(dto.permissions) : undefined,
        sort: dto.sort,
        status: dto.status as any
      }
    })

    return { code: 0, message: '更新成功', data: { ...role, permissions: parsePermissions(role.permissions) } }
  }

  async remove(id: number) {
    const role = await this.prisma.role.findUnique({ where: { id } })
    if (!role) throw new NotFoundException('角色不存在')

    const userCount = await this.prisma.adminUser.count({ where: { role: role.code } })
    if (userCount > 0) throw new BadRequestException('该角色已有用户使用，不能删除')

    await this.prisma.role.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }
}
