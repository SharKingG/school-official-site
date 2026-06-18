import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(keyword = '') {
    const where: any = {}

    if (keyword) {
      where.OR = [
        { username: { contains: keyword } },
        { nickname: { contains: keyword } },
        { role: { contains: keyword } }
      ]
    }

    const users = await this.prisma.adminUser.findMany({
      where,
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [{ id: 'asc' }]
    })

    const roles = await this.prisma.role.findMany()
    const roleMap = new Map(roles.map((item) => [item.code, item.name]))

    return {
      code: 0,
      message: '获取成功',
      data: users.map((item) => ({
        ...item,
        roleName: roleMap.get(item.role) || item.role
      }))
    }
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.adminUser.findUnique({ where: { username: dto.username } })
    if (exists) throw new BadRequestException('账号已存在')

    const role = await this.prisma.role.findUnique({ where: { code: dto.role } })
    if (!role) throw new BadRequestException('角色不存在')

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.adminUser.create({
      data: {
        username: dto.username.trim(),
        passwordHash,
        nickname: dto.nickname.trim(),
        role: dto.role,
        status: (dto.status as any) || 'ENABLED'
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    return { code: 0, message: '创建成功', data: user }
  }

  async update(id: number, dto: UpdateUserDto) {
    const exists = await this.prisma.adminUser.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('用户不存在')

    if (dto.role) {
      const role = await this.prisma.role.findUnique({ where: { code: dto.role } })
      if (!role) throw new BadRequestException('角色不存在')
    }

    const user = await this.prisma.adminUser.update({
      where: { id },
      data: {
        nickname: dto.nickname,
        role: dto.role,
        status: dto.status as any
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return { code: 0, message: '更新成功', data: user }
  }

  async resetPassword(id: number, dto: ResetPasswordDto) {
    const exists = await this.prisma.adminUser.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('用户不存在')

    const passwordHash = await bcrypt.hash(dto.password, 10)
    await this.prisma.adminUser.update({ where: { id }, data: { passwordHash } })

    return { code: 0, message: '密码已重置', data: true }
  }

  async remove(id: number) {
    const exists = await this.prisma.adminUser.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('用户不存在')

    if (exists.username === 'admin') {
      throw new BadRequestException('内置超级管理员不能删除')
    }

    await this.prisma.adminUser.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }
}
