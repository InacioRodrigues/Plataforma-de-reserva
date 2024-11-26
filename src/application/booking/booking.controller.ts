import { Controller, Post, Body, UseGuards, Get, Param, Patch, Request } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto';
import { UpdateBookingDto } from './UpdateBookingDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))  // Aplica o guard para todas as rotas
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  // Criar uma nova reserva
  @Post()
  async create(
    @Request() req,  // Acessando o usuário autenticado via req.user
    @Body() createBookingDto: CreateBookingDto,
  ) {
    const clientId = req.user.id;  // Acessando o id do cliente do toke
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
  async findClientBookings(@Request() req) {
    const clientId = req.user.id;  // Acessando o id do cliente do token JWT
    return this.bookingService.findByClient(clientId);
  }

  // Listar reservas de um provedor
  @Get('provider')
  async findProviderBookings(@Request() req) {
    const providerId = req.user.id;  // Acessando o id do provedor do token JWT
    return this.bookingService.findByProvider(providerId);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') bookingId: number) {
    return this.bookingService.cancel(bookingId);
  }
}
