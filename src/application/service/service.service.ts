import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateServiceDto } from './service.dto';
import { UpdateServiceDto } from './UpdateServiceDto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}
  
  // Criar um serviço
async create(providerId: number, createServiceDto: CreateServiceDto) {
  if (createServiceDto.price <= 0) {
    throw new BadRequestException('Service price must be positive');
  }
  return this.prisma.service.create({
    data: { ...createServiceDto, providerId },
  });
}


  // Atualizar um serviço
  async update(serviceId: number, providerId: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, providerId },
    });
    if (!service) {
      throw new NotFoundException('Service not found or access denied');
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: updateServiceDto,
    });
  }

  // Listar serviços de um provedor
  async findByProvider(providerId: number) {
    return this.prisma.service.findMany({
      where: { providerId },
    });
  }

  // Listar todos os serviços
  async findAll() {
    return this.prisma.service.findMany();
  }
}
