import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './UpdateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Criar usuário
  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    // Verificar duplicidade de NIF ou email
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: rest.email }, { nif: rest.nif }] },
    });
    if (existingUser) {
      throw new ConflictException('Email or NIF already in use');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: { ...rest, password: hashedPassword },
    });
  }

  // Atualizar usuário
  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  // Buscar usuário por ID
  async findById(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
