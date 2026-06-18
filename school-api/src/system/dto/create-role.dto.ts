import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: '请输入角色编码' })
  code!: string

  @IsString()
  @IsNotEmpty({ message: '请输入角色名称' })
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsArray()
  permissions!: string[]

  @IsOptional()
  @IsNumber()
  sort?: number

  @IsOptional()
  @IsString()
  status?: string
}
