import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty({ message: '文章标题不能为空' })
  title: string

  @IsOptional()
  @IsString()
  summary?: string

  @IsString()
  @IsNotEmpty({ message: '文章内容不能为空' })
  content: string

  @Type(() => Number)
  @IsInt({ message: '发布栏目不能为空' })
  categoryId: number

  @IsOptional()
  @IsString()
  author?: string

  @IsOptional()
  @IsString()
  source?: string

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsString()
  type?: 'NORMAL' | 'EXTERNAL_LINK'

  @IsOptional()
  @IsString()
  status?: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'OFFLINE'

  @IsOptional()
  @IsString()
  linkUrl?: string

  @IsOptional()
  @IsString()
  coverImage?: string

  @IsOptional()
  @IsString()
  listImage?: string

  @IsOptional()
  @IsString()
  headImage?: string

  @IsOptional()
  @IsBoolean()
  isTop?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @IsOptional()
  @IsString()
  publishedAt?: string
}
