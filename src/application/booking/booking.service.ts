import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateBookingDto} from './booking.dto';
import { UpdateBookingDto } from './UpdateBookingDto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar uma nova reserva
  async create(clientId: number, createBookingDto: CreateBookingDto) {
    const { serviceId, status } = createBookingDto;

    // Verificar se o serviço existe
    const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    throw new NotFoundException('Service not found');
  }

    // Verificar saldo do cliente
    const client = await this.prisma.user.findUnique({ where: { id: clientId } });
    if (!client || client.balance < service.price) {
      throw new BadRequestException('Insufficient balance');
    }

    // Transação: criar reserva e atualizar saldos
    return this.prisma.$transaction(async (tx) => {
      // Atualizar saldo do cliente
      await tx.user.update({
        where: { id: clientId },
        data: { balance: { decrement: service.price } },
      });

      // Atualizar saldo do provedor
      await tx.user.update({
        where: { id: service.providerId },
        data: { balance: { increment: service.price } },
      });

      // Criar reserva
      return tx.booking.create({
        data: {
          clientId,
          serviceId,
          status: status || 'PENDING',
        },
      });
    });
  }

  // Atualizar uma reserva
  async update(bookingId: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: updateBookingDto,
    });
  }

  // Listar reservas por cliente
  async findByClient(clientId: number) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: { service: true },
    });
  }

  // Listar reservas por provedor
  async findByProvider(providerId: number) {
    return this.prisma.booking.findMany({
      where: { service: { providerId } },
      include: { client: true },
    });
  }

  async cancel(bookingId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING') throw new BadRequestException('Only pending bookings can be canceled');
  
    return this.prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({ where: { id: booking.serviceId } });
  
      // Reembolsar cliente
      await tx.user.update({
        where: { id: booking.clientId },
        data: { balance: { increment: service.price } },
      });
  
      return tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELED' },
      });
    });
  }
  
}
