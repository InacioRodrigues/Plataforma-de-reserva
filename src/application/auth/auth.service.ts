import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma.service';
import { LoginDto } from './loginDto';
import * as bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  // Método de login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { accessToken: token };
  }

  // Buscar informações do usuário autenticado
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        console.log(`Usuário não encontrado para o e-mail ${email}`);
        return null;
      }

      // Supondo que a senha já esteja criptografada no momento da inserção
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        console.log(`Senha inválida para o e-mail ${email}`);
        return null; // Retorna null se a senha for inválida
      }

      return user; // Retorna o usuário se a senha for válida
    } catch (error) {
      console.error(`Erro ao validar usuário: ${error}`);
      return null;
    }
  }
}
