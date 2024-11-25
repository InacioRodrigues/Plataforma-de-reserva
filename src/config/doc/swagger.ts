import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const swagger = (app: NestExpressApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Plataforma de Reserva')
    .setDescription('Plataforma de reserva API description')
    .setVersion('0.0.1')
    .addTag('continents')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
