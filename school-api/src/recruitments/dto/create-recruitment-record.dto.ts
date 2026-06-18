import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRecruitmentRecordDto {
  @IsString()
  @IsNotEmpty({ message: "请输入姓名" })
  applicantName!: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsString()
  @IsNotEmpty({ message: "请输入联系电话" })
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}
