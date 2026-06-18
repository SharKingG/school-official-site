import { Module } from '@nestjs/common'
import { ArticlesController } from './articles.controller'
import { ArticlesService } from './articles.service'
import { PermissionsGuard } from '../common/guards/permissions.guard'

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PermissionsGuard]
})
export class ArticlesModule {}
