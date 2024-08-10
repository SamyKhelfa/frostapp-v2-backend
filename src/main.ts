import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService)

  const PORT = configService.get<number>('PORT')

  // Swagger

  const options = new DocumentBuilder()
    .setTitle('Frost App Server')
    .setDescription('Welcome to your API')
    .addServer(`http://localhost:${PORT}`)
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('doc', app, document)

    // Launch app

    await app.listen(PORT, () => {
      Logger.log(`Server running on port ${PORT}.`, 'BOOTSTRAP - SERVER STARTED');
    });
}
bootstrap();
