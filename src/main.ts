import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });


  app.setGlobalPrefix('api');
  app.enableCors();


  const config = new DocumentBuilder()
    .setTitle('PLATAFORMA DE RESERVA')
    .setDescription('API PARA O DESENVOLVIMENTO DE UMA PLATAFORMA DE RESERVA')
    .setVersion('1.0')
    .addTag('tag')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
