import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ContributionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { type?: string; month?: number; year?: number; massDate?: string }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.month) where.month = Number(filters.month);
    if (filters?.year) where.year = Number(filters.year);
    if (filters?.massDate) where.massDate = new Date(filters.massDate);

    return this.prisma.contribution.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { denominations: true }
    });
  }

  async create(data: {
    dizimistaId?: number;
    amount: number;
    method?: string;
    type?: string;
    date?: string;
    month?: number;
    year?: number;
    massDate?: string;
    denominations?: { kind: string; value: number; quantity: number }[];
    note?: string;
  }) {
    const contributionData: any = {
      amount: data.amount,
      method: data.method ?? 'presencial',
      type: data.type ?? 'oferta',
      date: data.date ? new Date(data.date) : new Date(),
      month: data.month ?? null,
      year: data.year ?? null,
      massDate: data.massDate ? new Date(data.massDate) : null,
      note: data.note ?? null,
      dizimistaId: data.dizimistaId ?? null,
    };

    // create contribution
    const created = await this.prisma.contribution.create({
      data: contributionData,
    });

    // create denominations if provided
    if (data.denominations && Array.isArray(data.denominations) && data.denominations.length > 0) {
      const denomCreates = data.denominations.map(d => ({
        contributionId: created.id,
        kind: d.kind,
        value: d.value,
        quantity: d.quantity,
      }));
      await this.prisma.contributionDenomination.createMany({
        data: denomCreates,
      });
      return this.prisma.contribution.findUnique({
        where: { id: created.id },
        include: { denominations: true },
      });
    }

    return created;
  }
}
