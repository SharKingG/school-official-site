import { IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '请输入账号' })
  username: string

  @IsString()
  @IsNotEmpty({ message: '请输入密码' })
  password: string
}
