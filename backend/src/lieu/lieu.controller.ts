import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LieuService } from './lieu.service';
import { CreateLieuDto, UpdateLieuDto } from './dto';

@ApiTags('Lieus')
@Controller('lieus')
export class LieuController {
  constructor(private readonly lieuService: LieuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lieu' })
  @ApiResponse({ status: 201, description: 'Lieu created successfully' })
  create(@Body() createLieuDto: CreateLieuDto) {
    return this.lieuService.create(createLieuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lieus' })
  @ApiResponse({ status: 200, description: 'List of all lieus' })
  findAll() {
    return this.lieuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lieu by ID' })
  @ApiParam({ name: 'id', description: 'Lieu ID' })
  @ApiResponse({ status: 200, description: 'Lieu found' })
  @ApiResponse({ status: 404, description: 'Lieu not found' })
  findOne(@Param('id') id: string) {
    return this.lieuService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lieu' })
  @ApiParam({ name: 'id', description: 'Lieu ID' })
  @ApiResponse({ status: 200, description: 'Lieu updated successfully' })
  @ApiResponse({ status: 404, description: 'Lieu not found' })
  update(@Param('id') id: string, @Body() updateLieuDto: UpdateLieuDto) {
    return this.lieuService.update(id, updateLieuDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lieu' })
  @ApiParam({ name: 'id', description: 'Lieu ID' })
  @ApiResponse({ status: 204, description: 'Lieu deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lieu not found' })
  remove(@Param('id') id: string) {
    return this.lieuService.remove(id);
  }
}
