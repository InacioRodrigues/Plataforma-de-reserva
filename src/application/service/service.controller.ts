import { Controller, Post, Body, UseGuards, Get, Patch, Param, Request } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './service.dto';
import { UpdateServiceDto } from './UpdateServiceDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('services')
@UseGuards(AuthGuard('jwt')) // Aplica o guard para todas as rotas
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Criar um serviço
  @Post()
  async create(
    @Request() req,  // Acessando o usuário autenticado via req.user
    @Body() createServiceDto: CreateServiceDto,
  ) {
    const providerId = req.user.id;  // Acessando o id do provedor do token JWT
    return this.serviceService.create(providerId, createServiceDto);
  }

  // Atualizar um serviço
  @Patch(':id')
  async update(
    @Param('id') serviceId: number,
    @Request() req,  // Acessando o usuário autenticado via req.user
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    const providerId = req.user.id;  // Acessando o id do provedor do token JWT
    return this.serviceService.update(serviceId, providerId, updateServiceDto);
  }

  // Listar serviços de um provedor
  @Get('provider')
  async findProviderServices(@Request() req) {
    const providerId = req.user.id;  // Acessando o id do provedor do token JWT
    return this.serviceService.findByProvider(providerId);
  }

  // Listar todos os serviços
  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }
}
