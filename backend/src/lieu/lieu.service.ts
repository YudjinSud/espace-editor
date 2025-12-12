import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLieuDto, UpdateLieuDto } from './dto';

@Injectable()
export class LieuService {
  constructor(private prisma: PrismaService) {}

  async create(createLieuDto: CreateLieuDto) {
    return this.prisma.lieu.create({
      data: createLieuDto,
      include: {
        elements: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.lieu.findMany({
      orderBy: { order: 'asc' },
      include: {
        elements: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const lieu = await this.prisma.lieu.findUnique({
      where: { id },
      include: {
        elements: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!lieu) {
      throw new NotFoundException(`Lieu with ID ${id} not found`);
    }

    return lieu;
  }

  async update(id: string, updateLieuDto: UpdateLieuDto) {
    await this.findOne(id);

    return this.prisma.lieu.update({
      where: { id },
      data: updateLieuDto,
      include: {
        elements: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.lieu.delete({
      where: { id },
    });
  }
}
