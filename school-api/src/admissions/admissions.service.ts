import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAdmissionPlanDto } from './dto/create-admission-plan.dto'
import { UpdateAdmissionPlanDto } from './dto/update-admission-plan.dto'
import { CreateAdmissionRecordDto } from './dto/create-admission-record.dto'

function toDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPlans(query: { status?: string; keyword?: string }) {
    const where: any = {}
    if (query.status) where.status = query.status
    if (query.keyword) {
      where.OR = [
        { title: { contains: query.keyword } },
        { description: { contains: query.keyword } },
        { target: { contains: query.keyword } }
      ]
    }

    const list = await this.prisma.admissionPlan.findMany({
      where,
      orderBy: [{ sort: 'asc' }, { id: 'desc' }],
      include: { _count: { select: { records: true } } }
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async findPlan(id: number) {
    const plan = await this.prisma.admissionPlan.findUnique({
      where: { id },
      include: { _count: { select: { records: true } } }
    })
    if (!plan) throw new NotFoundException('招生计划不存在')
    return { code: 0, message: '获取成功', data: plan }
  }

  async createPlan(dto: CreateAdmissionPlanDto) {
    if (!dto.title) throw new BadRequestException('请输入招生计划名称')

    const item = await this.prisma.admissionPlan.create({
      data: {
        title: dto.title,
        description: dto.description || null,
        target: dto.target || null,
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

  async updatePlan(id: number, dto: UpdateAdmissionPlanDto) {
    await this.ensurePlan(id)

    const item = await this.prisma.admissionPlan.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        target: dto.target,
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
    await this.prisma.admissionPlan.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  async findRecords(planId: number, keyword = '') {
    await this.ensurePlan(planId)
    const where: any = { planId }
    if (keyword) {
      where.OR = [
        { studentName: { contains: keyword } },
        { idCard: { contains: keyword } },
        { phone: { contains: keyword } },
        { school: { contains: keyword } }
      ]
    }

    const list = await this.prisma.admissionRecord.findMany({
      where,
      orderBy: [{ id: 'desc' }]
    })
    return { code: 0, message: '获取成功', data: list }
  }

  async createRecord(planId: number, dto: CreateAdmissionRecordDto) {
    const plan = await this.ensurePlan(planId)
    if (plan.status !== 'ENABLED') throw new BadRequestException('当前招生计划未启用')
    if (!dto.studentName) throw new BadRequestException('请输入学生姓名')
    if (!dto.idCard) throw new BadRequestException('请输入身份证号')
    if (!dto.phone) throw new BadRequestException('请输入联系电话')

    const item = await this.prisma.admissionRecord.create({
      data: {
        planId,
        studentName: dto.studentName,
        gender: dto.gender || null,
        idCard: dto.idCard,
        phone: dto.phone,
        school: dto.school || null,
        grade: dto.grade || null,
        score: dto.score || null,
        remark: dto.remark || null
      }
    })

    return { code: 0, message: '报名成功', data: item }
  }

  async removeRecord(id: number) {
    const item = await this.prisma.admissionRecord.findUnique({ where: { id } })
    if (!item) throw new NotFoundException('报名记录不存在')
    await this.prisma.admissionRecord.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  private async ensurePlan(id: number) {
    const plan = await this.prisma.admissionPlan.findUnique({ where: { id } })
    if (!plan) throw new NotFoundException('招生计划不存在')
    return plan
  }
}
