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
    /**
   * Retorna relatório para uma data de missa (YYYY-MM-DD)
   * - soma total de ofertas nessa data
   * - breakdown por denominação (kind, value => total quantity e total value)
   */
  async reportByMass(dateStr: string) {
    if (!dateStr) throw new Error('date required (YYYY-MM-DD)');

    const start = new Date(dateStr + 'T00:00:00');
    const end = new Date(dateStr + 'T23:59:59.999');

    // pega todas as contribuições com massDate no dia
    const contributions = await this.prisma.contribution.findMany({
      where: {
        massDate: { gte: start, lte: end },
      },
      include: { denominations: true },
    });

    // total geral (soma amounts)
    const totalGeral = contributions.reduce((s, c) => s + Number(c.amount), 0);

    // agregação por denominação (kind + value)
    const breakdownMap = new Map<string, { kind: string; value: number; quantity: number; totalValue: number }>();

    for (const c of contributions) {
      for (const d of c.denominations || []) {
        const key = `${d.kind}_${d.value}`;
        const existing = breakdownMap.get(key);
        const qty = Number(d.quantity);
        const totVal = Number(d.value) * qty;
        if (existing) {
          existing.quantity += qty;
          existing.totalValue += totVal;
        } else {
          breakdownMap.set(key, { kind: d.kind, value: Number(d.value), quantity: qty, totalValue: totVal });
        }
      }
    }

    const breakdown = Array.from(breakdownMap.values()).sort((a,b) => b.totalValue - a.totalValue);

    return {
      date: dateStr,
      totalGeral,
      contributionsCount: contributions.length,
      breakdown, // array { kind, value, quantity, totalValue }
      contributions // opcional: lista detalhada (se quiser)
    };
  }

}
