import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './middleware/global-exception.filter';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      credentials: true,
      exposedHeaders: 'Set-Cookie',
    },
  });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Lean nest')
    .setDescription('The nestjs API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth(undefined, 'Bearer Token')
    .addCookieAuth('access_token')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(configService.get('port'), '0.0.0.0', () => {
    console.log(`Server running on port ${configService.get('port')}`);
  });
}
bootstrap();
