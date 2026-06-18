import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(file: any, module = 'common') {
    const item = await this.prisma.uploadFile.create({
      data: {
        originalName: file.originalname,
        fileName: file.filename,
        fileUrl: `/uploads/${file.filename}`,
        fileSize: file.size || 0,
        mimeType: file.mimetype || null,
        module: module || 'common'
      }
    })

    return { code: 0, message: '上传成功', data: item }
  }

  async findAll(module?: string) {
    const where: any = {}
    if (module) where.module = module

    const list = await this.prisma.uploadFile.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }]
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async remove(id: number) {
    const item = await this.prisma.uploadFile.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('文件不存在')

    await this.prisma.uploadFile.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }
}
