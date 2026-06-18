import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateRecruitmentPlanDto } from './dto/create-recruitment-plan.dto'
import { UpdateRecruitmentPlanDto } from './dto/update-recruitment-plan.dto'
import { CreateRecruitmentRecordDto } from './dto/create-recruitment-record.dto'

function toDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

@Injectable()
export class RecruitmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPlans(query: { status?: string; keyword?: string }) {
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { department: { contains: query.keyword } },
        { description: { contains: query.keyword } },
        { requirements: { contains: query.keyword } }
      ]
    }

    const list = await this.prisma.recruitmentPlan.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }],
      include: { _count: { select: { records: true } } }
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async findPlan(id: number) {
    const plan = await this.prisma.recruitmentPlan.findUnique({
      where: { id },
      include: { _count: { select: { records: true } } }
    })
    if (!plan) throw new NotFoundException('招聘计划不存在')
    return { code: 0, message: '获取成功', data: plan }
  }

  async createPlan(dto: CreateRecruitmentPlanDto) {
    if (!dto.title) throw new BadRequestException('请输入招聘岗位名称')

    const item = await this.prisma.recruitmentPlan.create({
      data: {
        title: dto.title,
        department: dto.department || null,
        positionCount: Number(dto.positionCount || 1),
        description: dto.description || null,
        requirements: dto.requirements || null,
        startTime: toDate(dto.startTime),
        endTime: toDate(dto.endTime),
        contact: dto.contact || null,
        attachment: dto.attachment || null,
        sort: Number(dto.sort || 0),
        status: (dto.status as any) || 'ENABLED'
      }
    })

    return { code: 0, message: '创建成功', data: item }
  }

  async updatePlan(id: number, dto: UpdateRecruitmentPlanDto) {
    await this.ensurePlan(id)

    const item = await this.prisma.recruitmentPlan.update({
      where: { id },
      data: {
        title: dto.title,
        department: dto.department,
        positionCount: dto.positionCount === undefined ? undefined : Number(dto.positionCount),
        description: dto.description,
        requirements: dto.requirements,
        startTime: dto.startTime === undefined ? undefined : toDate(dto.startTime),
        endTime: dto.endTime === undefined ? undefined : toDate(dto.endTime),
        contact: dto.contact,
        attachment: dto.attachment,
        sort: dto.sort === undefined ? undefined : Number(dto.sort),
        status: dto.status as any
      }
    })

    return { code: 0, message: '更新成功', data: item }
  }

  async removePlan(id: number) {
    await this.ensurePlan(id)
    await this.prisma.recruitmentPlan.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  async findRecords(planId: number, keyword = '') {
    await this.ensurePlan(planId)
    const where: any = { planId }
    if (keyword) {
      where.OR = [
        { applicantName: { contains: keyword } },
        { phone: { contains: keyword } },
        { email: { contains: keyword } },
        { major: { contains: keyword } }
      ]
    }

    const list = await this.prisma.recruitmentRecord.findMany({
      where,
      orderBy: [{ id: 'desc' }]
    })
    return { code: 0, message: '获取成功', data: list }
  }

  async createRecord(planId: number, dto: CreateRecruitmentRecordDto) {
    const plan = await this.ensurePlan(planId)
    if (plan.status !== 'ENABLED') throw new BadRequestException('当前招聘计划未启用')
    if (!dto.applicantName) throw new BadRequestException('请输入姓名')
    if (!dto.phone) throw new BadRequestException('请输入联系电话')

    const item = await this.prisma.recruitmentRecord.create({
      data: {
        planId,
        applicantName: dto.applicantName,
        gender: dto.gender || null,
        phone: dto.phone,
        email: dto.email || null,
        education: dto.education || null,
        major: dto.major || null,
        attachmentUrl: dto.attachmentUrl || null,
        remark: dto.remark || null
      }
    })

    return { code: 0, message: '投递成功', data: item }
  }

  async removeRecord(id: number) {
    const item = await this.prisma.recruitmentRecord.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('投递记录不存在')
    await this.prisma.recruitmentRecord.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  private async ensurePlan(id: number) {
    const plan = await this.prisma.recruitmentPlan.findUnique({ where: { id } })
    if (!plan) throw new NotFoundException('招聘计划不存在')
    return plan
  }
}
