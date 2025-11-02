import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DizimistasModule } from './dizimistas/dizimistas.module';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [DizimistasModule, ContributionsModule],
  providers: [PrismaService],
  
})
export class AppModule {}
