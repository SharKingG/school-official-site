import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { AdmissionsService } from './admissions.service'
import { CreateAdmissionPlanDto } from './dto/create-admission-plan.dto'
import { UpdateAdmissionPlanDto } from './dto/update-admission-plan.dto'
import { CreateAdmissionRecordDto } from './dto/create-admission-record.dto'

@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Get('plans')
  findPlans(@Query('status') status?: string, @Query('keyword') keyword = '') {
    return this.admissionsService.findPlans({ status, keyword })
  }

  @Get('plans/:id')
  findPlan(@Param('id', ParseIntPipe) id: number) {
    return this.admissionsService.findPlan(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('plans')
  createPlan(@Body() dto: CreateAdmissionPlanDto) {
    return this.admissionsService.createPlan(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('plans/:id')
  updatePlan(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAdmissionPlanDto) {
    return this.admissionsService.updatePlan(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('plans/:id')
  removePlan(@Param('id', ParseIntPipe) id: number) {
    return this.admissionsService.removePlan(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('plans/:planId/records')
  findRecords(@Param('planId', ParseIntPipe) planId: number, @Query('keyword') keyword = '') {
    return this.admissionsService.findRecords(planId, keyword)
  }

  @Post('plans/:planId/records')
  createRecord(@Param('planId', ParseIntPipe) planId: number, @Body() dto: CreateAdmissionRecordDto) {
    return this.admissionsService.createRecord(planId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('records/:id')
  removeRecord(@Param('id', ParseIntPipe) id: number) {
    return this.admissionsService.removeRecord(id)
  }
}
