import { Module } from '@nestjs/common'
import { SystemController } from './system.controller'
import { UsersService } from './users.service'
import { RolesService } from './roles.service'
import { LogsService } from './logs.service'
import { PermissionsGuard } from '../common/guards/permissions.guard'

@Module({
  controllers: [SystemController],
  providers: [UsersService, RolesService, LogsService, PermissionsGuard]
})
export class SystemModule {}
