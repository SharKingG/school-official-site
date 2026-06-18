import { IsOptional, IsString } from 'class-validator'

export class CreateBackupDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  backupType?: string

  @IsOptional()
  @IsString()
  scope?: string

  @IsOptional()
  @IsString()
  description?: string
}
