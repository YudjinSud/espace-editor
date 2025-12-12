import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class ElementOrderItem {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderElementsDto {
  @ApiProperty({ type: [ElementOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ElementOrderItem)
  elements: ElementOrderItem[];
}
