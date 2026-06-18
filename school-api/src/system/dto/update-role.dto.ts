import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  permissions?: string[]

  @IsOptional()
  @IsNumber()
  sort?: number

  @IsOptional()
  @IsString()
  status?: string
}
