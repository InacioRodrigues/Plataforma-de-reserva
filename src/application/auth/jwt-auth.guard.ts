import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super();
    }

    // Método principal para validar o token e permitir o acesso à rota
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        console.log('Token recebido:', token);

        if (!token) {
            throw new UnauthorizedException('Authentication token is missing');
        }

        try {
            const decoded = this.jwtService.verify(token);
            console.log('Token validado:', decoded);
            request.user = decoded; // Armazena os dados do token no objeto de requisição
            return true;
        } catch (error) {
            console.error('Erro de validação do token:', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    // Método para extrair o token do cabeçalho Authorization
    private extractToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}
