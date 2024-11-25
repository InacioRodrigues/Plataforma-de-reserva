import { Controller, Post, Body, Patch, Param, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './UpdateUserDto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Criar um novo usuário
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Atualizar informações do usuário autenticado
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  // Buscar informações do usuário autenticado
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') userId: number) {
    return this.userService.findById(userId);
  }
}
