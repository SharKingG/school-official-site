import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateHomeSectionDto } from './dto/create-home-section.dto'
import { UpdateHomeSectionDto } from './dto/update-home-section.dto'
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto'
import { CreateBackupDto } from './dto/create-backup.dto'

const defaultSettingMeta: Record<string, { label: string; group: string; type?: string; sort?: number; remark?: string }> = {
  schoolName: { label: '学校名称', group: 'BASIC', sort: 1 },
  schoolEnglishName: { label: '英文名称', group: 'BASIC', sort: 2 },
  logo: { label: '学校 Logo', group: 'BASIC', sort: 3 },
  banner: { label: '默认首页横幅', group: 'BASIC', sort: 4 },
  slogan: { label: '学校校训/口号', group: 'BASIC', sort: 5 },
  subSlogan: { label: '首页副标题', group: 'BASIC', sort: 6 },
  address: { label: '学校地址', group: 'CONTACT', sort: 10 },
  phone: { label: '联系电话', group: 'CONTACT', sort: 11 },
  email: { label: '邮箱', group: 'CONTACT', sort: 12 },
  postcode: { label: '邮政编码', group: 'CONTACT', sort: 13 },
  icp: { label: '备案号', group: 'FOOTER', sort: 20 },
  copyrightYear: { label: '版权年份', group: 'FOOTER', sort: 21 },
  browserTitle: { label: '浏览器标题', group: 'SEO', sort: 30 },
  searchPlaceholder: { label: '搜索框提示语', group: 'SEO', sort: 31 },
  enableArticleReview: { label: '是否开启文章审核', group: 'PARAM', type: 'BOOLEAN', sort: 40 },
  enableAdmission: { label: '是否开启招生报名', group: 'PARAM', type: 'BOOLEAN', sort: 41 },
  enableRecruitment: { label: '是否开启招聘投递', group: 'PARAM', type: 'BOOLEAN', sort: 42 },
  enablePublicQueryCaptcha: { label: '公共查询是否启用验证码', group: 'PARAM', type: 'BOOLEAN', sort: 43 },
  uploadMaxSizeMb: { label: '上传文件大小限制 MB', group: 'PARAM', type: 'NUMBER', sort: 44 },
  allowedUploadTypes: { label: '允许上传的文件类型', group: 'PARAM', type: 'TEXT', sort: 45 }
}

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  private toMap(items: any[]) {
    return items.reduce((result, item) => {
      result[item.settingKey] = item.settingValue ?? ''
      return result
    }, {} as Record<string, string>)
  }

  async getPublicSettings() {
    const items = await this.prisma.siteSetting.findMany({
      orderBy: [{ settingGroup: 'asc' }, { sort: 'asc' }, { id: 'asc' }]
    })

    return { code: 0, message: '获取成功', data: this.toMap(items) }
  }

  async getAdminSettings(group?: string) {
    const where: any = {}
    if (group) where.settingGroup = group

    const list = await this.prisma.siteSetting.findMany({
      where,
      orderBy: [{ settingGroup: 'asc' }, { sort: 'asc' }, { id: 'asc' }]
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async updateSettings(dto: UpdateSiteSettingsDto) {
    const items = dto.items || []

    for (const item of items) {
      const meta = defaultSettingMeta[item.key] || { label: item.key, group: 'CUSTOM', sort: 999 }
      await this.prisma.siteSetting.upsert({
        where: { settingKey: item.key },
        update: { settingValue: item.value ?? '' },
        create: {
          settingKey: item.key,
          label: meta.label,
          settingValue: item.value ?? '',
          valueType: meta.type || 'TEXT',
          settingGroup: meta.group,
          sort: meta.sort || 999,
          remark: meta.remark || null
        }
      })
    }

    return this.getAdminSettings()
  }

  async getHomeSections(onlyVisible = false) {
    const list = await this.prisma.homeSection.findMany({
      where: onlyVisible ? { visible: true } : {},
      orderBy: [{ sort: 'asc' }, { id: 'asc' }]
    })

    return { code: 0, message: '获取成功', data: list }
  }

  async createHomeSection(dto: CreateHomeSectionDto) {
    const item = await this.prisma.homeSection.create({
      data: {
        title: dto.title,
        icon: dto.icon || '',
        categorySlug: dto.categorySlug || null,
        categoryId: dto.categoryId || null,
        articleLimit: dto.articleLimit ?? 5,
        moreLink: dto.moreLink || null,
        layout: dto.layout || 'CARD',
        sort: dto.sort ?? 0,
        visible: dto.visible ?? true
      }
    })

    return { code: 0, message: '新增成功', data: item }
  }

  async updateHomeSection(id: number, dto: UpdateHomeSectionDto) {
    const item = await this.prisma.homeSection.update({
      where: { id },
      data: {
        ...dto,
        categoryId: dto.categoryId === undefined ? undefined : dto.categoryId,
        articleLimit: dto.articleLimit === undefined ? undefined : Number(dto.articleLimit),
        sort: dto.sort === undefined ? undefined : Number(dto.sort)
      }
    })

    return { code: 0, message: '保存成功', data: item }
  }

  async removeHomeSection(id: number) {
    const exists = await this.prisma.homeSection.findUnique({ where: { id } })
    if (!exists) throw new NotFoundException('首页栏目不存在')

    await this.prisma.homeSection.delete({ where: { id } })
    return { code: 0, message: '删除成功', data: true }
  }

  async getBackupRecords() {
    const list = await this.prisma.backupRecord.findMany({ orderBy: { createdAt: 'desc' } })
    return { code: 0, message: '获取成功', data: list }
  }

  async createBackup(dto: CreateBackupDto, user?: any) {
    const title = dto.title || `手动备份 ${new Date().toLocaleString('zh-CN')}`
    const item = await this.prisma.backupRecord.create({
      data: {
        title,
        backupType: dto.backupType || 'MANUAL',
        scope: dto.scope || 'CONFIG_AND_BUSINESS',
        description: dto.description || '系统生成备份记录。当前阶段为备份管理 MVP，正式部署阶段将接入 mysqldump 自动备份。',
        status: 'SUCCESS',
        createdBy: user?.username || 'system'
      }
    })

    return { code: 0, message: '备份记录已生成', data: item }
  }

  async exportSnapshot() {
    const [settings, homeSections, categories, articles, banners, links, leaders, admissions, recruitments, queryProjects] = await Promise.all([
      this.prisma.siteSetting.findMany({ orderBy: [{ settingGroup: 'asc' }, { sort: 'asc' }] }),
      this.prisma.homeSection.findMany({ orderBy: [{ sort: 'asc' }] }),
      this.prisma.category.findMany({ orderBy: [{ sort: 'asc' }] }),
      this.prisma.article.findMany({ orderBy: [{ id: 'desc' }], take: 100 }),
      this.prisma.banner.findMany({ orderBy: [{ sort: 'asc' }] }),
      this.prisma.linkItem.findMany({ orderBy: [{ category: 'asc' }, { sort: 'asc' }] }),
      this.prisma.leader.findMany({ orderBy: [{ sort: 'asc' }] }),
      this.prisma.admissionPlan.findMany({ include: { records: true }, orderBy: [{ id: 'desc' }] }),
      this.prisma.recruitmentPlan.findMany({ include: { records: true }, orderBy: [{ id: 'desc' }] }),
      this.prisma.queryProject.findMany({ include: { records: true }, orderBy: [{ id: 'desc' }] })
    ])

    return {
      code: 0,
      message: '导出成功',
      data: {
        exportedAt: new Date().toISOString(),
        settings,
        homeSections,
        categories,
        articles,
        banners,
        links,
        leaders,
        admissions,
        recruitments,
        queryProjects
      }
    }
  }
}
