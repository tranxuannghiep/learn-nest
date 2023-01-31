import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as cookieParser from 'cookie-parser';
import fastifyCookie from '@fastify/cookie';
import { jwtConstants } from './utils/constants';

async function bootstrap() {
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  // await app.register(fastifyCookie, {
  //   secret: jwtConstants.secret, // for cookies signature
  // });
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}
bootstrap();
