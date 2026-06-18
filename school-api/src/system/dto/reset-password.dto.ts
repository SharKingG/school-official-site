import { IsNotEmpty, IsString } from 'class-validator'

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: '请输入新密码' })
  password!: string
}
