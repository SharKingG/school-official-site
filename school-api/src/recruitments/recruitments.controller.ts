import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RecruitmentsService } from './recruitments.service'
import { CreateRecruitmentPlanDto } from './dto/create-recruitment-plan.dto'
import { UpdateRecruitmentPlanDto } from './dto/update-recruitment-plan.dto'
import { CreateRecruitmentRecordDto } from './dto/create-recruitment-record.dto'

@Controller('recruitments')
export class RecruitmentsController {
  constructor(private readonly recruitmentsService: RecruitmentsService) {}

  @Get('plans')
  findPlans(@Query('status') status?: string, @Query('keyword') keyword = '') {
    return this.recruitmentsService.findPlans({ status, keyword })
  }

  @Get('plans/:id')
  findPlan(@Param('id', ParseIntPipe) id: number) {
    return this.recruitmentsService.findPlan(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('plans')
  createPlan(@Body() dto: CreateRecruitmentPlanDto) {
    return this.recruitmentsService.createPlan(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('plans/:id')
  updatePlan(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecruitmentPlanDto) {
    return this.recruitmentsService.updatePlan(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('plans/:id')
  removePlan(@Param('id', ParseIntPipe) id: number) {
    return this.recruitmentsService.removePlan(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('plans/:planId/records')
  findRecords(@Param('planId', ParseIntPipe) planId: number, @Query('keyword') keyword = '') {
    return this.recruitmentsService.findRecords(planId, keyword)
  }

  @Post('plans/:planId/records')
  createRecord(@Param('planId', ParseIntPipe) planId: number, @Body() dto: CreateRecruitmentRecordDto) {
    return this.recruitmentsService.createRecord(planId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('records/:id')
  removeRecord(@Param('id', ParseIntPipe) id: number) {
    return this.recruitmentsService.removeRecord(id)
  }
}
