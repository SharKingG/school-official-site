import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateHomeSectionDto {
  @IsString()
  @IsNotEmpty({ message: '请输入首页栏目标题' })
  title!: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  categorySlug?: string

  @IsOptional()
  @IsInt()
  categoryId?: number

  @IsOptional()
  @IsInt()
  articleLimit?: number

  @IsOptional()
  @IsString()
  moreLink?: string

  @IsOptional()
  @IsString()
  layout?: string

  @IsOptional()
  @IsInt()
  sort?: number

  @IsOptional()
  @IsBoolean()
  visible?: boolean
}
