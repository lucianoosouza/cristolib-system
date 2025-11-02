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
    async create(data: { dizimistaId: number; amount: number; method?: string; date?: string }) {
        return this.prisma.contribution.create({
            data: {
                dizimistaId: data.dizimistaId,
                amount: data.amount,
                // Prisma exige o campo 'type' (string). Aqui usamos o body.method como fallback.
                type: data.method ?? 'presencial',
                date: data.date ? new Date(data.date) : new Date(),
            },
        });
    }


}
