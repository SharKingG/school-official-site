import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAdmissionRecordDto {
  @IsString()
  @IsNotEmpty({ message: '请输入学生姓名' })
  studentName!: string

  @IsOptional()
  @IsString()
  gender?: string

  @IsString()
  @IsNotEmpty({ message: '请输入身份证号' })
  idCard!: string

  @IsString()
  @IsNotEmpty({ message: '请输入联系电话' })
  phone!: string

  @IsOptional()
  @IsString()
  school?: string

  @IsOptional()
  @IsString()
  grade?: string

  @IsOptional()
  @IsString()
  score?: string

  @IsOptional()
  @IsString()
  remark?: string
}
