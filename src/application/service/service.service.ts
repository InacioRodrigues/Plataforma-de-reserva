import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateServiceDto } from './service.dto';
import { UpdateServiceDto } from './UpdateServiceDto';

@Injectable()
export class ServiceService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar um serviço
  async create(providerId: number, createServiceDto: CreateServiceDto) {
    console.log('ID do Provedor:', providerId);

    if (!providerId) {
      throw new UnauthorizedException('ID do Provedor está ausente ou inválido.');
    }

    return this.prisma.service.create({
      data: {
        ...createServiceDto,
        providerId: providerId,
      },
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
