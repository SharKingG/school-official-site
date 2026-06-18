import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { PermissionsGuard } from '../common/guards/permissions.guard'
import { Permissions } from '../common/decorators/permissions.decorator'
import { UsersService } from './users.service'
import { RolesService } from './roles.service'
import { LogsService } from './logs.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { AuditService } from '../audit/audit.service'

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('system')
export class SystemController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly logsService: LogsService,
    private readonly auditService: AuditService
  ) {}

  @Permissions('system:manage')
  @Get('users')
  findUsers(@Query('keyword') keyword = '') {
    return this.usersService.findAll(keyword)
  }

  @Permissions('system:manage')
  @Post('users')
  async createUser(@Body() dto: CreateUserDto, @Req() req: any) {
    const result = await this.usersService.create(dto)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '新增用户', targetType: 'admin_user', targetId: result.data.id, description: `新增用户：${dto.username}` })
    return result
  }

  @Permissions('system:manage')
  @Patch('users/:id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto, @Req() req: any) {
    const result = await this.usersService.update(id, dto)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '编辑用户', targetType: 'admin_user', targetId: id, description: `编辑用户：${result.data.username}` })
    return result
  }

  @Permissions('system:manage')
  @Patch('users/:id/password')
  async resetPassword(@Param('id', ParseIntPipe) id: number, @Body() dto: ResetPasswordDto, @Req() req: any) {
    const result = await this.usersService.resetPassword(id, dto)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '重置密码', targetType: 'admin_user', targetId: id, description: `重置用户密码：${id}` })
    return result
  }

  @Permissions('system:manage')
  @Delete('users/:id')
  async removeUser(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.usersService.remove(id)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '删除用户', targetType: 'admin_user', targetId: id, description: `删除用户：${id}` })
    return result
  }

  @Permissions('system:manage')
  @Get('roles')
  findRoles() {
    return this.rolesService.findAll()
  }

  @Permissions('system:manage')
  @Get('permissions')
  findPermissions() {
    return this.rolesService.findPermissions()
  }

  @Permissions('system:manage')
  @Post('roles')
  async createRole(@Body() dto: CreateRoleDto, @Req() req: any) {
    const result = await this.rolesService.create(dto)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '新增角色', targetType: 'role', targetId: result.data.id, description: `新增角色：${dto.name}` })
    return result
  }

  @Permissions('system:manage')
  @Patch('roles/:id')
  async updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto, @Req() req: any) {
    const result = await this.rolesService.update(id, dto)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '编辑角色', targetType: 'role', targetId: id, description: `编辑角色：${result.data.name}` })
    return result
  }

  @Permissions('system:manage')
  @Delete('roles/:id')
  async removeRole(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const result = await this.rolesService.remove(id)
    await this.auditService.log({ user: req.user, module: '系统管理', action: '删除角色', targetType: 'role', targetId: id, description: `删除角色：${id}` })
    return result
  }

  @Permissions('log:view')
  @Get('logs')
  findLogs(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
    @Query('module') module = '',
    @Query('keyword') keyword = ''
  ) {
    return this.logsService.findAll({ page: Number(page), pageSize: Number(pageSize), module, keyword })
  }
}
