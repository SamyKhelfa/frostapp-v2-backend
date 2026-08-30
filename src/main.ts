import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DEV_ORIGINS = ['http://localhost:5173'];

function allowedOrigins(): string[] {
  const configured = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configured?.length ? configured : DEV_ORIGINS;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: allowedOrigins(),
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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
