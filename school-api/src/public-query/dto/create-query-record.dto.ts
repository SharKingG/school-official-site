import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateQueryRecordDto {
  @IsString()
  @IsNotEmpty({ message: '请输入姓名' })
  name!: string

  @IsOptional()
  @IsString()
  idCard?: string

  @IsOptional()
  @IsString()
  ticketNo?: string

  @IsString()
  @IsNotEmpty({ message: '请输入查询结果标题' })
  resultTitle!: string

  @IsOptional()
  @IsString()
  resultContent?: string

  @IsOptional()
  @IsString()
  fileUrl?: string
}
