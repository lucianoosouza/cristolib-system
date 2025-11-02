import { Controller, Get, Post, Body } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: { dizimistaId: number; amount: number; method?: string; date?: string }) {
    return this.service.create(body);
  }
}
