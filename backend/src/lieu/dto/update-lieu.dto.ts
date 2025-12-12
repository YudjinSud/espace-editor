import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateLieuDto {
  @ApiPropertyOptional({ example: 'Mon Appartement Modifié' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
