import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateElementDto, UpdateElementDto, ReorderElementsDto } from './dto';

@Injectable()
export class ElementService {
  constructor(private prisma: PrismaService) {}

  async create(lieuId: string, createElementDto: CreateElementDto) {
    // Verify lieu exists
    const lieu = await this.prisma.lieu.findUnique({ where: { id: lieuId } });
    if (!lieu) {
      throw new NotFoundException(`Lieu with ID ${lieuId} not found`);
    }

    // If parentId provided, verify parent exists and belongs to same lieu
    if (createElementDto.parentId) {
      const parent = await this.prisma.element.findUnique({
        where: { id: createElementDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent element with ID ${createElementDto.parentId} not found`);
      }
      if (parent.lieuId !== lieuId) {
        throw new BadRequestException('Parent element must belong to the same lieu');
      }
      if (parent.type !== 'niveau') {
        throw new BadRequestException('Parent element must be of type "niveau"');
      }
    }

    return this.prisma.element.create({
      data: {
        ...createElementDto,
        lieuId,
      },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAllByLieu(lieuId: string) {
    const lieu = await this.prisma.lieu.findUnique({ where: { id: lieuId } });
    if (!lieu) {
      throw new NotFoundException(`Lieu with ID ${lieuId} not found`);
    }

    return this.prisma.element.findMany({
      where: { lieuId },
      orderBy: { order: 'asc' },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(lieuId: string, id: string) {
    const element = await this.prisma.element.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!element) {
      throw new NotFoundException(`Element with ID ${id} not found`);
    }

    if (element.lieuId !== lieuId) {
      throw new NotFoundException(`Element with ID ${id} not found in lieu ${lieuId}`);
    }

    return element;
  }

  async update(lieuId: string, id: string, updateElementDto: UpdateElementDto) {
    await this.findOne(lieuId, id);

    // If changing parentId, validate new parent
    if (updateElementDto.parentId !== undefined && updateElementDto.parentId !== null) {
      const parent = await this.prisma.element.findUnique({
        where: { id: updateElementDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent element with ID ${updateElementDto.parentId} not found`);
      }
      if (parent.lieuId !== lieuId) {
        throw new BadRequestException('Parent element must belong to the same lieu');
      }
      if (parent.type !== 'niveau') {
        throw new BadRequestException('Parent element must be of type "niveau"');
      }
      if (parent.id === id) {
        throw new BadRequestException('Element cannot be its own parent');
      }
    }

    return this.prisma.element.update({
      where: { id },
      data: updateElementDto,
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(lieuId: string, id: string) {
    await this.findOne(lieuId, id);

    return this.prisma.element.delete({
      where: { id },
    });
  }

  async reorder(lieuId: string, reorderDto: ReorderElementsDto) {
    const lieu = await this.prisma.lieu.findUnique({ where: { id: lieuId } });
    if (!lieu) {
      throw new NotFoundException(`Lieu with ID ${lieuId} not found`);
    }

    // Update all elements in a transaction
    await this.prisma.$transaction(
      reorderDto.elements.map((item) =>
        this.prisma.element.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    return this.findAllByLieu(lieuId);
  }
}
