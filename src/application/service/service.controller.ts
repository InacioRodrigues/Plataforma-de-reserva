import { Controller, Post, Body, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './service.dto';
import { UpdateServiceDto } from './UpdateServiceDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';


@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Criar um serviço
  @Post()
  async create(
    @CurrentUser('id') providerId: number,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.serviceService.create(providerId, createServiceDto);
  }

  // Atualizar um serviço
  @Patch(':id')
  async update(
    @Param('id') serviceId: number,
    @CurrentUser('id') providerId: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(serviceId, providerId, updateServiceDto);
  }

  // Listar serviços de um provedor
  @Get('provider')
  async findProviderServices(@CurrentUser('id') providerId: number) {
    return this.serviceService.findByProvider(providerId);
  }

  // Listar todos os serviços
  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }
}
