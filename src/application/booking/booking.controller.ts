import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto';
import { UpdateBookingDto } from './UpdateBookingDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';


@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  // Criar uma nova reserva
  @Post()
  async create(
    @CurrentUser('id') clientId: number,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(clientId, createBookingDto);
  }

  // Atualizar uma reserva
  @Patch(':id')
  async update(
    @Param('id') bookingId: number,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(bookingId, updateBookingDto);
  }

  // Listar reservas do cliente autenticado
  @Get('client')
  async findClientBookings(@CurrentUser('id') clientId: number) {
    return this.bookingService.findByClient(clientId);
  }

  // Listar reservas de um provedor
  @Get('provider')
  async findProviderBookings(@CurrentUser('id') providerId: number) {
    return this.bookingService.findByProvider(providerId);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') bookingId: number) {
    return this.bookingService.cancel(bookingId);
  }

}
