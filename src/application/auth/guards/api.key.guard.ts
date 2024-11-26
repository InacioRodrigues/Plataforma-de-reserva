import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { API_KEYS } from 'src/application/helpers/keys.helper';
  
  @Injectable()
  export class ApiKeyGuard implements CanActivate {
    constructor() {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        console.log('Headers:', req.headers);
        // Verifique se o token JWT está presente
        const apiKey = req.headers['x-apikey'];
        console.log('API Key:', apiKey);
      
        if (!apiKey) {
          throw new UnauthorizedException(
            'You are not allowed to access this resource!',
          );
        }
      
        const canAccess = API_KEYS.includes(apiKey);
      
        if (!canAccess) {
          throw new UnauthorizedException(
            'You are not allowed to access this resource!',
          );
        }
      
        return canAccess;
      }
      
  }