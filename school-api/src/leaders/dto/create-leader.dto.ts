import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateLeaderDto {
  @IsString()
  @IsNotEmpty({ message: '领导姓名不能为空' })
  name: string

  @IsString()
  @IsNotEmpty({ message: '职务不能为空' })
  title: string

  @IsOptional()
  @IsString()
  photo?: string

  @IsOptional()
  @IsString()
  intro?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sort?: number

  @IsOptional()
  @IsString()
  status?: 'ENABLED' | 'DISABLED'
}
