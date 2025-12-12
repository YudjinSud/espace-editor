import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';

export class CreateElementDto {
  @ApiProperty({ example: 'Rez-de-chaussée' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['niveau', 'espace'], example: 'niveau' })
  @IsEnum(['niveau', 'espace'])
  type: 'niveau' | 'espace';

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({ description: 'Parent element ID (for espaces under niveaux)' })
  @IsOptional()
  @IsString()
  parentId?: string;
}
