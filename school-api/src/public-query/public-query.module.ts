import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { PublicQueryController } from './public-query.controller'
import { PublicQueryService } from './public-query.service'

@Module({
  imports: [PrismaModule],
  controllers: [PublicQueryController],
  providers: [PublicQueryService],
  exports: [PublicQueryService]
})
export class PublicQueryModule {}
