import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty({ message: '横幅名称不能为空' })
  title: string

  @IsOptional()
  @IsString()
  subtitle?: string

  @IsString()
  @IsNotEmpty({ message: '图片地址不能为空' })
  imageUrl: string

  @IsOptional()
  @IsString()
  linkUrl?: string

  @IsOptional()
  @IsString()
  position?: string

  @IsOptional()
  @IsString()
  size?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @IsOptional()
  @IsString()
  status?: 'ENABLED' | 'DISABLED'
}
