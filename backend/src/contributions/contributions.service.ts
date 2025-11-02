import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContributionsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.contribution.findMany({
            orderBy: { date: 'desc' },
        });
    }
    // backend/src/contributions/contributions.service.ts
async create(data: { dizimistaId: number; amount: number; method?: string; type?: string; date?: string }) {
  return this.prisma.contribution.create({
    data: {
      dizimistaId: data.dizimistaId,
      amount: data.amount,
      // preencher BOTH 'method' e 'type' porque o schema exige ambos
      method: data.method ?? data.type ?? 'presencial',
      type: data.type ?? data.method ?? 'oferta',
      date: data.date ? new Date(data.date) : new Date(),
    },
  });
}



}
