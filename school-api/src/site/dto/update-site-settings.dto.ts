import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class SiteSettingItemDto {
  @IsString()
  key!: string

  @IsOptional()
  @IsString()
  value?: string
}

export class UpdateSiteSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SiteSettingItemDto)
  items!: SiteSettingItemDto[]
}
