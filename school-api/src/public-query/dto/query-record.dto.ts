import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class QueryRecordDto {
  @IsString()
  @IsNotEmpty({ message: '请输入姓名' })
  name!: string

  @IsOptional()
  @IsString()
  idCard?: string

  @IsOptional()
  @IsString()
  ticketNo?: string
}
