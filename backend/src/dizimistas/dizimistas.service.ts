// backend/src/dizimistas/dizimistas.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DizimistasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dizimista.findMany();
  }

  async create(data: { name: string; communityId: number }) {
    return this.prisma.dizimista.create({ data });
  }
}
