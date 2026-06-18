import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateQueryProjectDto {
  @IsString()
  @IsNotEmpty({ message: "请输入查询项目名称" })
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  queryFields?: string;

  @IsOptional()
  @IsNumber()
  sort?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
