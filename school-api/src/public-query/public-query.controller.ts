import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { PublicQueryService } from './public-query.service'
import { CreateQueryProjectDto } from './dto/create-query-project.dto'
import { UpdateQueryProjectDto } from './dto/update-query-project.dto'
import { CreateQueryRecordDto } from './dto/create-query-record.dto'
import { QueryRecordDto } from './dto/query-record.dto'

@Controller('public-query')
export class PublicQueryController {
  constructor(private readonly publicQueryService: PublicQueryService) {}

  @Get('projects')
  findProjects(@Query('status') status?: string, @Query('keyword') keyword = '') {
    return this.publicQueryService.findProjects({ status, keyword })
  }

  @Get('projects/:id')
  findProject(@Param('id', ParseIntPipe) id: number) {
    return this.publicQueryService.findProject(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('projects')
  createProject(@Body() dto: CreateQueryProjectDto) {
    return this.publicQueryService.createProject(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('projects/:id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateQueryProjectDto) {
    return this.publicQueryService.updateProject(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('projects/:id')
  removeProject(@Param('id', ParseIntPipe) id: number) {
    return this.publicQueryService.removeProject(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('projects/:projectId/records')
  findRecords(@Param('projectId', ParseIntPipe) projectId: number, @Query('keyword') keyword = '') {
    return this.publicQueryService.findRecords(projectId, keyword)
  }

  @UseGuards(JwtAuthGuard)
  @Post('projects/:projectId/records')
  createRecord(@Param('projectId', ParseIntPipe) projectId: number, @Body() dto: CreateQueryRecordDto) {
    return this.publicQueryService.createRecord(projectId, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('records/:id')
  updateRecord(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateQueryRecordDto>) {
    return this.publicQueryService.updateRecord(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('records/:id')
  removeRecord(@Param('id', ParseIntPipe) id: number) {
    return this.publicQueryService.removeRecord(id)
  }

  @Post('projects/:projectId/search')
  publicSearch(@Param('projectId', ParseIntPipe) projectId: number, @Body() dto: QueryRecordDto) {
    return this.publicQueryService.publicSearch(projectId, dto)
  }
}
