// backend/src/dizimistas/dizimistas.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { DizimistasService } from './dizimistas.service';

@Controller('dizimistas')
export class DizimistasController {
  constructor(private readonly service: DizimistasService) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: { name: string; communityId: number }) {
    return this.service.create(body);
  }
}
