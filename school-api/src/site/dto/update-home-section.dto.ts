import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator'

export class UpdateHomeSectionDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  icon?: string

  @IsOptional()
  @IsString()
  categorySlug?: string

  @IsOptional()
  @IsInt()
  categoryId?: number | null

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
