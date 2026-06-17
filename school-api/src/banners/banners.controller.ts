import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { BannersService } from './banners.service'
import { CreateBannerDto } from './dto/create-banner.dto'
import { UpdateBannerDto } from './dto/update-banner.dto'

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll(@Query('position') position?: string, @Query('status') status?: string) {
    return this.bannersService.findAll({ position, status })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id)
  }
}
