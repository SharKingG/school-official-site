import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateQueryProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

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
