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
import { ElementService } from './element.service';
import { CreateElementDto, UpdateElementDto, ReorderElementsDto } from './dto';

@ApiTags('Elements')
@Controller('lieus/:lieuId/elements')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new element (niveau or espace)' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiResponse({ status: 201, description: 'Element created successfully' })
  @ApiResponse({ status: 404, description: 'Lieu or parent not found' })
  create(
    @Param('lieuId') lieuId: string,
    @Body() createElementDto: CreateElementDto,
  ) {
    return this.elementService.create(lieuId, createElementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all elements of a lieu' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiResponse({ status: 200, description: 'List of elements' })
  @ApiResponse({ status: 404, description: 'Lieu not found' })
  findAll(@Param('lieuId') lieuId: string) {
    return this.elementService.findAllByLieu(lieuId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an element by ID' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiParam({ name: 'id', description: 'Element ID' })
  @ApiResponse({ status: 200, description: 'Element found' })
  @ApiResponse({ status: 404, description: 'Element not found' })
  findOne(@Param('lieuId') lieuId: string, @Param('id') id: string) {
    return this.elementService.findOne(lieuId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an element' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiParam({ name: 'id', description: 'Element ID' })
  @ApiResponse({ status: 200, description: 'Element updated successfully' })
  @ApiResponse({ status: 404, description: 'Element not found' })
  update(
    @Param('lieuId') lieuId: string,
    @Param('id') id: string,
    @Body() updateElementDto: UpdateElementDto,
  ) {
    return this.elementService.update(lieuId, id, updateElementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an element' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiParam({ name: 'id', description: 'Element ID' })
  @ApiResponse({ status: 204, description: 'Element deleted successfully' })
  @ApiResponse({ status: 404, description: 'Element not found' })
  remove(@Param('lieuId') lieuId: string, @Param('id') id: string) {
    return this.elementService.remove(lieuId, id);
  }

  @Post('reorder')
  @ApiOperation({ summary: 'Reorder elements' })
  @ApiParam({ name: 'lieuId', description: 'Lieu ID' })
  @ApiResponse({ status: 200, description: 'Elements reordered successfully' })
  reorder(
    @Param('lieuId') lieuId: string,
    @Body() reorderDto: ReorderElementsDto,
  ) {
    return this.elementService.reorder(lieuId, reorderDto);
  }
}
