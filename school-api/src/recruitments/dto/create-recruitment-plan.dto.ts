import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateRecruitmentPlanDto {
  @IsString()
  @IsNotEmpty({ message: "请输入招聘岗位名称" })
  title!: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsNumber()
  positionCount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  attachment?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
