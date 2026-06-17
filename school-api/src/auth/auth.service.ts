import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

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

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      role: user.role,
      nickname: user.nickname
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
          role: user.role
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

    return {
      code: 0,
      message: '获取成功',
      data: user
    }
  }
}
