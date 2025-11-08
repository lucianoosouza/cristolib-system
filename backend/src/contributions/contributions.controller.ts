import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ContributionsService } from './contributions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
    @Query('massDate') massDate?: string,
  ) {
    return this.service.findAll({
      type,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      massDate,
    });
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }
    @Get('reports/mass')
  async reportByMass(@Query('date') date?: string) {
    if (!date) {
      return { error: 'query parameter `date` is required (YYYY-MM-DD)' };
    }
    return this.service.reportByMass(date);
  }

}
