import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateAdmissionPlanDto {
  @IsString()
  @IsNotEmpty({ message: '请输入招生计划名称' })
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  target?: string

  @IsOptional()
  @IsString()
  startTime?: string

  @IsOptional()
  @IsString()
  endTime?: string

  @IsOptional()
  @IsString()
  contact?: string

  @IsOptional()
  @IsString()
  attachment?: string

  @IsOptional()
  @IsNumber()
  sort?: number

  @IsOptional()
  @IsString()
  status?: string
}
