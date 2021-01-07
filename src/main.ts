import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import * as Env from './env';
import { fastifyHelmet } from 'fastify-helmet';
import compress from 'fastify-compress';
import { types } from 'pg';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  types.setTypeParser(20, Number.parseInt);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.register(fastifyHelmet);
  app.register(compress, { encodings: ['gzip', 'deflate'] });
  await app.listen(Env.PORT);
}

bootstrap();
