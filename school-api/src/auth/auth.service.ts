import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { DEFAULT_ROLE_PERMISSIONS, parsePermissions } from '../common/permissions'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  private async getRoleInfo(roleCode: string) {
    let roleName = roleCode
    let permissions = DEFAULT_ROLE_PERMISSIONS[roleCode] || []

    try {
      const role = await this.prisma.role.findUnique({ where: { code: roleCode } })

      if (role?.status === 'ENABLED') {
        roleName = role.name
        permissions = parsePermissions(role.permissions)
      }
    } catch (error) {
      permissions = DEFAULT_ROLE_PERMISSIONS[roleCode] || []
    }

    return { roleName, permissions }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username: dto.username }
    })

    if (!user || user.status !== 'ENABLED') {
      throw new UnauthorizedException('账号或密码错误')
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash)

    if (!passwordOk) {
      throw new UnauthorizedException('账号或密码错误')
    }

    const roleInfo = await this.getRoleInfo(user.role)

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
      nickname: user.nickname,
      permissions: roleInfo.permissions
    })

    return {
      code: 0,
      message: '登录成功',
      data: {
        accessToken,
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          role: user.role,
          roleName: roleInfo.roleName,
          permissions: roleInfo.permissions
        }
      }
    }
  }

  async profile(userId: number) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    if (!user) {
      throw new UnauthorizedException('账号不存在')
    }

    const roleInfo = await this.getRoleInfo(user.role)

    return {
      code: 0,
      message: '获取成功',
      data: {
        ...user,
        roleName: roleInfo.roleName,
        permissions: roleInfo.permissions
      }
    }
  }
}
