import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { UploadsService } from './uploads.service'

function ensureUploadDir() {
  const dir = join(process.cwd(), 'uploads')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function makeSafeFileName(originalName = '') {
  const ext = extname(originalName)
  const random = Math.round(Math.random() * 1e9)
  return `${Date.now()}-${random}${ext}`
}

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          callback(null, ensureUploadDir())
        },
        filename: (_req, file, callback) => {
          callback(null, makeSafeFileName(file.originalname || ''))
        }
      }),
      limits: {
        fileSize: 20 * 1024 * 1024
      }
    })
  )
  async upload(@UploadedFile() file: any, @Body('module') module = 'common') {
    if (!file) throw new BadRequestException('请选择要上传的文件')
    return this.uploadsService.create(file, module)
  }

  @Get()
  findAll(@Query('module') module?: string) {
    return this.uploadsService.findAll(module)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uploadsService.remove(id)
  }
}
