import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '请输入账号' })
  username!: string

  @IsString()
  @IsNotEmpty({ message: '请输入密码' })
  password!: string

  @IsString()
  @IsNotEmpty({ message: '请输入姓名' })
  nickname!: string

  @IsString()
  @IsNotEmpty({ message: '请选择角色' })
  role!: string

  @IsOptional()
  @IsString()
  status?: string
}
