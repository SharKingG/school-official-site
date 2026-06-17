import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty({ message: '链接名称不能为空' })
  name: string

  @IsString()
  @IsNotEmpty({ message: '链接地址不能为空' })
  url: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  openTarget?: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @IsOptional()
  @IsString()
  status?: 'ENABLED' | 'DISABLED'
}
