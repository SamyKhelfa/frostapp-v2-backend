import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  const configService: ConfigService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT');

  const options = new DocumentBuilder()
    .setTitle('Frost App Server')
    .setDescription('Welcome to your API')
    .addServer(`http://localhost:${PORT}`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT, () => {
    Logger.log(`Server running on port ${PORT}.`, 'BOOTSTRAP - SERVER STARTED');
  });
}
bootstrap();
