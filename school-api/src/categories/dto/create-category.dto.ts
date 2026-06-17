import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: '栏目名称不能为空' })
  name: string

  @IsString()
  @IsNotEmpty({ message: '栏目标识不能为空' })
  slug: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @IsOptional()
  @IsString()
  status?: 'ENABLED' | 'DISABLED'

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsString()
  path?: string
}
