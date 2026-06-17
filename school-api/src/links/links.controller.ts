import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CreateLinkDto } from './dto/create-link.dto'
import { UpdateLinkDto } from './dto/update-link.dto'
import { LinksService } from './links.service'

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('status') status?: string) {
    return this.linksService.findAll({ category, status })
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.linksService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateLinkDto) {
    return this.linksService.create(dto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLinkDto) {
    return this.linksService.update(id, dto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.linksService.remove(id)
  }
}
