import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateRecruitmentPlanDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsNumber()
  positionCount?: number

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  requirements?: string

  @IsOptional()
  @IsString()
  startTime?: string | null

  @IsOptional()
  @IsString()
  endTime?: string | null

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
