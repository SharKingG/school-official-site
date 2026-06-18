import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { PermissionsGuard } from '../common/guards/permissions.guard'
import { Permissions } from '../common/decorators/permissions.decorator'
import { AuditService } from '../audit/audit.service'
import { SiteService } from './site.service'
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto'
import { CreateHomeSectionDto } from './dto/create-home-section.dto'
import { UpdateHomeSectionDto } from './dto/update-home-section.dto'
import { CreateBackupDto } from './dto/create-backup.dto'

@Controller('site')
export class SiteController {
  constructor(
    private readonly siteService: SiteService,
    private readonly auditService: AuditService
  ) {}

  @Get('settings')
  getPublicSettings() {
    return this.siteService.getPublicSettings()
  }

  @Get('home-sections')
  getPublicHomeSections() {
    return this.siteService.getHomeSections(true)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Get('admin/settings')
  getAdminSettings(@Query('group') group?: string) {
    return this.siteService.getAdminSettings(group)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Patch('admin/settings')
  async updateSettings(@Body() dto: UpdateSiteSettingsDto, @Req() req: any) {
    const result = await this.siteService.updateSettings(dto)
    await this.auditService.log({ user: req.user, module: '站点配置', action: '保存站点设置', targetType: 'site_settings', description: '更新站点基础信息和系统参数' })
    return result
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Get('admin/home-sections')
  getAdminHomeSections() {
    return this.siteService.getHomeSections(false)
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Post('admin/home-sections')
  async createHomeSection(@Body() dto: CreateHomeSectionDto, @Req() req: any) {
    const result = await this.siteService.createHomeSection(dto)
    await this.auditService.log({ user: req.user, module: '首页配置', action: '新增首页栏目', targetType: 'home_section', targetId: result.data.id, description: `新增首页栏目：${dto.title}` })
    return result
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Patch('admin/home-sections/:id')
  async updateHomeSection(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHomeSectionDto, @Req() req: any) {
    const result = await this.siteService.updateHomeSection(id, dto)
    await this.auditService.log({ user: req.user, module: '首页配置', action: '编辑首页栏目', targetType: 'home_section', targetId: id, description: `编辑首页栏目：${result.data.title}` })
    return result
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Delete('admin/home-sections/:id')
  async removeHomeSection(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.siteService.removeHomeSection(id)
    await this.auditService.log({ user: req.user, module: '首页配置', action: '删除首页栏目', targetType: 'home_section', targetId: id, description: `删除首页栏目：${id}` })
    return result
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Get('admin/backups')
  getBackups() {
    return this.siteService.getBackupRecords()
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Post('admin/backups')
  async createBackup(@Body() dto: CreateBackupDto, @Req() req: any) {
    const result = await this.siteService.createBackup(dto, req.user)
    await this.auditService.log({ user: req.user, module: '数据备份', action: '生成备份记录', targetType: 'backup_record', targetId: result.data.id, description: result.data.title })
    return result
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('site:manage')
  @Get('admin/backups/export')
  exportSnapshot() {
    return this.siteService.exportSnapshot()
  }
}
