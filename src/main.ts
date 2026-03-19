import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception';
import { GlobalValidationPipe } from './validation.pipe';
import { APP } from '@/config/app-config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app: any = await (NestFactory.create as any)(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new GlobalValidationPipe({ whitelist: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle(APP.title)
    .setDescription(APP.description)
    .setVersion(APP.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(APP.port, '0.0.0.0');
  logger.log(`Application is running on: http://localhost:${APP.port}`);
  logger.log(`Swagger docs: http://localhost:${APP.port}/api/docs`);
}
bootstrap();
