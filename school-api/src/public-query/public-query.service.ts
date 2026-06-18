import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateQueryProjectDto } from './dto/create-query-project.dto'
import { UpdateQueryProjectDto } from './dto/update-query-project.dto'
import { CreateQueryRecordDto } from './dto/create-query-record.dto'
import { QueryRecordDto } from './dto/query-record.dto'

@Injectable()
export class PublicQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findProjects(query: { status?: string; keyword?: string }) {
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { description: { contains: query.keyword } }
      ]
    }

    const list = await this.prisma.queryProject.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }],
      include: { _count: { select: { records: true } } }
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async findProject(id: number) {
    const item = await this.prisma.queryProject.findUnique({
      where: { id },
      include: { _count: { select: { records: true } } }
    })
    if (!item) throw new NotFoundException('查询项目不存在')
    return { code: 0, message: '获取成功', data: item }
  }

  async createProject(dto: CreateQueryProjectDto) {
    if (!dto.title) throw new BadRequestException('请输入查询项目名称')
    const item = await this.prisma.queryProject.create({
      data: {
        title: dto.title,
        description: dto.description || null,
        queryFields: dto.queryFields || 'name,idCard',
        sort: Number(dto.sort || 0),
        status: (dto.status as any) || 'ENABLED'
      }
    })
    return { code: 0, message: '创建成功', data: item }
  }

  async updateProject(id: number, dto: UpdateQueryProjectDto) {
    await this.ensureProject(id)
    const item = await this.prisma.queryProject.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        queryFields: dto.queryFields,
        sort: dto.sort === undefined ? undefined : Number(dto.sort),
        status: dto.status as any
      }
    })
    return { code: 0, message: '更新成功', data: item }
  }

  async removeProject(id: number) {
    await this.ensureProject(id)
    await this.prisma.queryProject.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  async findRecords(projectId: number, keyword = '') {
    await this.ensureProject(projectId)
    const where: any = { projectId }
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { idCard: { contains: keyword } },
        { ticketNo: { contains: keyword } },
        { resultTitle: { contains: keyword } }
      ]
    }

    const list = await this.prisma.queryRecord.findMany({
      where,
      orderBy: [{ id: 'desc' }]
    })
    return { code: 0, message: '获取成功', data: list }
  }

  async createRecord(projectId: number, dto: CreateQueryRecordDto) {
    await this.ensureProject(projectId)
    if (!dto.name) throw new BadRequestException('请输入姓名')
    if (!dto.resultTitle) throw new BadRequestException('请输入查询结果标题')

    const item = await this.prisma.queryRecord.create({
      data: {
        projectId,
        name: dto.name,
        idCard: dto.idCard || null,
        ticketNo: dto.ticketNo || null,
        resultTitle: dto.resultTitle,
        resultContent: dto.resultContent || null,
        fileUrl: dto.fileUrl || null
      }
    })
    return { code: 0, message: '创建成功', data: item }
  }

  async updateRecord(id: number, dto: Partial<CreateQueryRecordDto>) {
    const exists = await this.prisma.queryRecord.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('查询数据不存在')

    const item = await this.prisma.queryRecord.update({
      where: { id },
      data: {
        name: dto.name,
        idCard: dto.idCard,
        ticketNo: dto.ticketNo,
        resultTitle: dto.resultTitle,
        resultContent: dto.resultContent,
        fileUrl: dto.fileUrl
      }
    })
    return { code: 0, message: '更新成功', data: item }
  }

  async removeRecord(id: number) {
    const exists = await this.prisma.queryRecord.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('查询数据不存在')
    await this.prisma.queryRecord.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  async publicSearch(projectId: number, dto: QueryRecordDto) {
    const project = await this.ensureProject(projectId)
    if (project.status !== 'ENABLED') throw new BadRequestException('当前查询项目未启用')
    if (!dto.name) throw new BadRequestException('请输入姓名')

    const where: any = { projectId, name: dto.name }
    if (dto.idCard) where.idCard = dto.idCard
    if (dto.ticketNo) where.ticketNo = dto.ticketNo

    const list = await this.prisma.queryRecord.findMany({
      where,
      orderBy: [{ id: 'desc' }]
    })

    return {
      code: 0,
      message: list.length > 0 ? '查询成功' : '未查询到结果',
      data: list
    }
  }

  private async ensureProject(id: number) {
    const item = await this.prisma.queryProject.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('查询项目不存在')
    return item
  }
}
