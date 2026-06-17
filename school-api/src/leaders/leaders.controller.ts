import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CreateLeaderDto } from './dto/create-leader.dto'
import { UpdateLeaderDto } from './dto/update-leader.dto'
import { LeadersService } from './leaders.service'

@Controller('leaders')
export class LeadersController {
  constructor(private readonly leadersService: LeadersService) {}

  @Get()
  findAll(@Query('status') status?: string) {
    return this.leadersService.findAll(status)
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leadersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLeaderDto) {
    return this.leadersService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeaderDto) {
    return this.leadersService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leadersService.remove(id)
  }
}
