import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateElementDto {
  @ApiPropertyOptional({ example: 'Premier étage' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Parent element ID (null to make orphan)' })
  @IsOptional()
  @IsString()
  parentId?: string | null;
}
