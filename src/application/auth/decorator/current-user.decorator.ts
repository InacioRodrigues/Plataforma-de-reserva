import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // Retorna o campo específico solicitado (ex: 'id', 'email') ou o objeto completo
    return data ? user?.[data] : user;
  },
);
