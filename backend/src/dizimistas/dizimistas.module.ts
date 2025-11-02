// backend/src/dizimistas/dizimistas.module.ts
import { Module } from '@nestjs/common';
import { DizimistasService } from './dizimistas.service';
import { DizimistasController } from './dizimistas.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DizimistasController],
  providers: [DizimistasService, PrismaService],
})
export class DizimistasModule {}
